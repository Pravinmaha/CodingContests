import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SelectQuestionsPanel from '../components/SelectQuestionPanel';
import { addQuestionToContest, editContest, getFullContest, removeQuestionFromContest } from '../services/contestService';
import { useProblems } from '../contexts/ProblemContext';
import RegisteredUsersTable from '../components/RegisteredUsersTable';

const ContestPage = () => {
  const [contest, setContest] = useState(null);
  const [isEditable, setIsEditable] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const { problems } = useProblems();
  const { contestId } = useParams();
  const navigate = useNavigate();


  useEffect(() => {
    getFullContest(contestId)
      .then(data => setContest(data))
      .catch(err => console.error('Error fetching contest details', err));
  }, [contestId]);

  const handleInputChange = (field, value) => {
    setContest(prev => {
      const updated = { ...prev, [field]: value };

      const start = new Date(updated.startTime).getTime();
      const end = new Date(updated.endTime).getTime();
      const duration = parseInt(updated.duration); // in minutes

      if (updated.startTime && updated.duration && field !== 'endTime') {
        updated.endTime = toLocalDatetimeString(start + duration * 60000);
      } else if (updated.endTime && updated.startTime && field !== 'duration') {
        updated.duration = Math.max(Math.round((end - start) / 60000), 0);
      } else if (updated.endTime && updated.duration && field !== 'startTime') {
        updated.startTime = toLocalDatetimeString(end - duration * 60000);
      }

      return updated;
    });
  };


  function toLocalDatetimeString(dateInput) {
    const date = new Date(dateInput);
    const year = date.getFullYear();
    const month = (`0${date.getMonth() + 1}`).slice(-2);
    const day = (`0${date.getDate()}`).slice(-2);
    const hours = (`0${date.getHours()}`).slice(-2);
    const minutes = (`0${date.getMinutes()}`).slice(-2);
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }



  const handleSaveChanges = () => {
    const data = {
      title: contest.title,
      description: contest.description,
      startTime: contest.startTime,
      endTime: contest.endTime,
      duration: contest.duration,
      isPublic: contest.isPublic,
      isPublished: contest.isPublished
    }
    editContest(data, contest._id)
      .then((res) => {
        setContest(res);
        alert("Details saved succesfully");
        setIsEditable(prev => !prev)
      })
      .catch((err) => {
        console.log("Error occurred while editing contest details")
      })
  }

  const handleCheckboxChange = (question) => {
    setSelectedQuestions(prev => {
      const exists = prev.find(q => q.question._id === question._id);
      const alreadyInContest = contest.questions.some(q => q.question._id === question._id || q._id === question._id);

      if (exists) {
        return prev.filter(q => q.question._id !== question._id);
      } else if (alreadyInContest) {
        console.log("Already added in contest");
        return prev;
      } else {
        return [...prev, { question: question, score: 10 }];
      }
    });
  };



  const handleAddSelectedQuestions = () => {
    const selectedQuestionIds = selectedQuestions.map(entry => ({ question: entry.question._id, score: entry.score }))
    addQuestionToContest(selectedQuestionIds, contest._id)
      .then((data) => {
        setContest(data);
        setSelectedQuestions([]);
        setShowPopup(false);
        alert("Questions added succesfully");
      })
      .catch((err) => {
        console.log("Error occurred while editing contest details", err)
      })
  };

  const handleRemove = id => {
    removeQuestionFromContest(id, contest._id)
      .then((data) => {
        setContest(data)
        alert("Questions removed succesfully");
      })
      .catch((err) => {
        console.log("Error while removing question", err)
      });
  };


  if (!contest) return <div style={styles.container}>Loading...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.headerWrapper}>
        <h1 style={styles.heading}>Contest Details</h1>
        <div>
          <button
            style={{ ...styles.editBtn, marginRight: '20px' }}
            onClick={() => navigate(`/contests/${contest._id}/`)}
          >
            Preview
          </button>
          {<button style={styles.editBtn} onClick={() => setIsEditable(prev => !prev)}>
            {isEditable ? 'X' : 'Edit'}
          </button>}
        </div>
      </div>

      {isEditable ? <>      <div style={styles.section}>
        {['title', 'description', 'duration'].map(field => (
          <div key={field} style={styles.fieldWrapper}>
            <label style={styles.label}>{field.replace(/([A-Z])/g, ' $1')}:</label>
            <input
              type="text"
              style={styles.input}
              value={contest[field]}
              onChange={e => handleInputChange(field, e.target.value)}
              autoFocus
            />
          </div>
        ))}

        <div style={styles.rowTwoColumns}>
          {['startTime', 'endTime'].map(field => (
            <div key={field} style={styles.fieldWrapper}>
              <label style={styles.label}>{field.replace(/([A-Z])/g, ' $1')}:</label>
              <input
                type="datetime-local"
                style={styles.input}
                value={toLocalDatetimeString(contest[field])}
                onChange={e => handleInputChange(field, e.target.value)}
                autoFocus
              />

            </div>
          ))}
        </div>


        <div style={styles.rowTwoColumns}>
          {['isPublic', 'isPublished'].map(field => (
            <div key={field} style={styles.fieldWrapper}>
              <label style={styles.label}>{field.replace(/([A-Z])/g, ' $1')}:</label>
              <label style={styles.switch}>
                <input
                  type="checkbox"
                  checked={contest[field]}
                  onChange={e => handleInputChange(field, e.target.checked)}
                  style={styles.switchInput}
                />
                <span style={{
                  ...styles.slider,
                  backgroundColor: contest[field] ? '#4ade80' : '#555',
                }}>
                  <span style={{
                    ...styles.sliderThumb,
                    transform: contest[field] ? 'translateX(18px)' : 'translateX(0)',
                  }} />
                </span>
              </label>
            </div>
          ))}
        </div>
        {isEditable && (
          <div style={styles.saveBtnWrapper}>
            <button style={styles.saveBtn} onClick={handleSaveChanges}>
              Save
            </button>
          </div>
        )}

      </div>
      </>
        : <>
          <div style={styles.section}>
            {['title', 'description', 'duration'].map(field => (
              <div key={field} style={styles.fieldWrapper}>
                <label style={styles.label}>{field.replace(/([A-Z])/g, ' $1')}:</label>

                <div style={styles.inlineDisplay}>
                  <span>{contest[field]}</span>
                </div>
              </div>
            ))}

            <div style={styles.rowTwoColumns}>
              {['startTime', 'endTime'].map(field => (
                <div key={field} style={styles.fieldWrapper}>
                  <label style={styles.label}>{field.replace(/([A-Z])/g, ' $1')}:</label>
                  <div style={styles.inlineDisplay}>
                    <span>{new Date(contest[field]).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>


            <div style={styles.rowTwoColumns}>
              {['isPublic', 'isPublished'].map(field => (
                <div key={field} style={styles.fieldWrapper}>
                  <label style={styles.label}>{field.replace(/([A-Z])/g, ' $1')}:</label>
                  <label style={styles.switch}>
                    <input
                      type="checkbox"
                      checked={contest[field]}
                      style={styles.switchInput}
                    />
                    <span style={{
                      ...styles.slider,
                      backgroundColor: contest[field] ? '#4ade80' : '#555',
                    }}>
                      <span style={{
                        ...styles.sliderThumb,
                        transform: contest[field] ? 'translateX(18px)' : 'translateX(0)',
                      }} />
                    </span>
                  </label>
                </div>
              ))}
            </div>
          </div> </>}

      <div style={styles.section}>
        <h2 style={styles.subheading}>Questions</h2>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Title</th>
              <th style={styles.th}>Difficulty</th>
              <th style={styles.th}>Tags</th>
              <th style={styles.th}> Score</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {contest.questions.map(q => (
              <tr key={q.question._id}>
                <td style={styles.td}>{q.question.title}</td>
                <td style={styles.td}>{q.question.difficulty}</td>
                <td style={styles.td}>{q.question.tags?.join(', ')}</td>
                <td style={styles.td}>{q.score}</td>
                <td style={styles.td}>
                  <button
                    style={{ ...styles.removeBtn, marginLeft: '10px' }}
                    onClick={() => handleRemove(q.question._id)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}

          </tbody>
        </table>

        <button style={styles.addBtn} onClick={() => setShowPopup(true)}>+ Add Question</button>

        {!showPopup && selectedQuestions?.length > 0 && <div style={styles.selectedQuestionsBox}>
          <h3 style={styles.selectedTitle}>Selected Questions</h3>
          {selectedQuestions.map((entry, i) => (
            <div key={entry.question._id} style={styles.questionCard}>
              <div style={styles.questionHeader}>
                <span style={styles.questionTitle}>{entry.question.title}</span>
              </div>
              <div style={styles.scoreInputWrapper}>
                <input
                  type="number"
                  style={styles.input}
                  value={entry.score}
                  onChange={(e) => {
                    const newScore = parseInt(e.target.value);
                    setSelectedQuestions(prev =>
                      prev.map((q, index) =>
                        index === i ? { ...q, score: newScore } : q
                      )
                    );
                  }}
                />
              </div>
            </div>
          ))}
          <div style={{ textAlign: 'right', marginTop: '20px' }}>
            <button
              onClick={handleAddSelectedQuestions}
              style={styles.updateBtn}
            >
              ✅ Update Questions
            </button>
          </div>
        </div>
        }

        {showPopup && (
          <SelectQuestionsPanel
            problems={problems}
            selectedQuestions={selectedQuestions}
            onCheckboxChange={handleCheckboxChange}
            onAddSelectedQuestions={() => {
              setShowPopup(false);
            }}
            onClose={() => setShowPopup(false)}
          />
        )}
      </div>
      <RegisteredUsersTable usersData={contest.registeredUsers} contestId={contest._id} />
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#121212',
    minHeight: '100vh',
    color: '#f1f1f1',
  },
  headerWrapper: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  heading: {
    fontSize: '32px',
    fontWeight: '800',
    marginBottom: '30px',
    color: '#f9fafb',
    letterSpacing: '0.5px',
  },
  section: {
    marginBottom: '40px',
    position: 'relative'
  },
  fieldWrapper: {
    marginBottom: '20px',
    flex: 1,
  },
  label: {
    display: 'block',
    fontWeight: 'bold',
    marginBottom: '6px',
    color: '#ccc',
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #444',
    backgroundColor: '#1c1c1c',
    color: '#f1f1f1',
    fontSize: '15px',
  },
  inlineDisplay: {
    backgroundColor: '#1e1e1e',
    borderRadius: '6px',
    padding: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  editBtn: {
    backgroundColor: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    padding: '6px 12px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  saveBtnWrapper: {
    position: 'absolute',
    bottom: '20px',
    right: '20px',
    zIndex: 999,
  },
  saveBtn: {
    backgroundColor: '#22c55e',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 20px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)',
  },

  subheading: {
    fontSize: '22px',
    marginBottom: '20px',
    fontWeight: '700',
    color: '#e5e7eb',
  },
  table: {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: 0,
    backgroundColor: '#1f1f1f',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.4)',
  },
  th: {
    textAlign: 'left',
    padding: '12px 16px',
    backgroundColor: '#2a2a2a',
    color: '#f5f5f5',
    borderBottom: '1px solid #444',
    fontWeight: '600',
  },
  td: {
    padding: '12px 16px',
    borderBottom: '1px solid #333',
    color: '#ddd',
    fontSize: '14px',
  },
  removeBtn: {
    backgroundColor: '#dc2626',
    color: '#fff',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  addBtn: {
    backgroundColor: '#10b981',
    color: '#fff',
    border: 'none',
    padding: '10px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: 'bold',
    marginTop: '10px',
  },
  rowTwoColumns: {
    display: 'flex',
    gap: '20px',
    marginTop: '10px',
    flexWrap: 'wrap',
  },
  switch: {
    position: 'relative',
    display: 'inline-block',
    width: '42px',
    height: '24px',
  },
  switchInput: {
    opacity: 0,
    width: 0,
    height: 0,
  },
  slider: {
    position: 'absolute',
    cursor: 'pointer',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: '24px',
    transition: '.4s',
  },
  sliderThumb: {
    position: 'absolute',
    content: '""',
    height: '18px',
    width: '18px',
    left: '3px',
    bottom: '3px',
    backgroundColor: 'white',
    borderRadius: '50%',
    transition: '.4s',
  },
  selectedQuestionsBox: {
    marginTop: '30px',
    padding: '20px',
    backgroundColor: '#1a1a1a',
    borderRadius: '10px',
    border: '1px solid #333',
    boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
  },

  selectedTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#f1f1f1',
    marginBottom: '16px',
  },

  questionCard: {
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: '#262626',
    padding: '16px',
    borderRadius: '8px',
    marginBottom: '16px',
    border: '1px solid #444',
  },

  questionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },

  questionTitle: {
    fontSize: '16px',
    color: '#e0e0e0',
    fontWeight: '600',
  },

  scoreInputWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },

  updateBtn: {
    backgroundColor: '#3b82f6',
    color: '#fff',
    border: 'none',
    padding: '10px 18px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
  },

  updateBtnHover: {
    backgroundColor: '#2563eb',
  },

};

export default ContestPage;
