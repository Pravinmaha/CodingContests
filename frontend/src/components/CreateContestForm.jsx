import React, { useState } from 'react';
import SelectQuestionsPanel from './SelectQuestionPanel';
import { useProblems } from '../contexts/ProblemContext';

const CreateContestForm = ({ onClose, onCreate }) => {
    const [newContest, setNewContest] = useState({
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        duration: '',
        isPublic: true,
        isPublished: false,
        questions: [{
            question: '',
            score: 0
        }]
    });

    const [showQuestionPanel, setShowQuestionPanel] = useState(false);
    const [questions, setQuestions] = useState([]);
    const { problems, loading, error } = useProblems();
    if (loading) return <div>Loading....</div>
    if (error) return <div>{error}</div>


    const [selectedQuestions, setSelectedQuestions] = useState([]);

    const handleChange = (field, value) => {
        setNewContest(prev => {
            const updated = { ...prev, [field]: value };

            const start = new Date(updated.startTime).getTime();
            const end = new Date(updated.endTime).getTime();
            const duration = parseInt(updated.duration); // in minutes

            if (updated.startTime && updated.duration && field !== 'endTime') {
                updated.endTime = toLocalDatetimeString(start + duration * 60000);
            } else if (updated.endTime && updated.startTime && field !== 'duration') {
                if(updated.endTime < updated.startTime){
                    updated.endTime = updated.startTime;
                  }
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


    const handleCheckboxChange = (question) => {
        setSelectedQuestions(prev => {
            const exists = prev.some(entry => entry.question._id === question._id);
            if (exists) {
                return prev.filter(entry => entry.question._id !== question._id);
            } else {
                return [...prev, { question, score: 10 }];
            }
        });
    };


    const handleAddSelectedQuestions = () => {
        const selected = problems
            .filter(q =>
                selectedQuestions.some(sq => sq.question._id === q._id) &&
                !questions.some(existing => existing.question._id === q._id)
            )
            .map(q => ({
                question: q,
                score: 10 // default score
            }));

        setQuestions(prev => [...prev, ...selected]);
        setSelectedQuestions([]);
        setShowQuestionPanel(false);
    };



    const handleRemoveQuestion = (id) => {
        setQuestions(prev => prev.filter(q => q.question._id !== id));
    };


    const handleSubmit = () => {
        const { title, startTime, endTime, duration } = newContest;
        if (!title.trim() || !startTime || !endTime || !duration.trim()) {
            alert('Please fill all required fields');
            return;
        }

        const formattedContest = {
            ...newContest,
            duration: Number(duration),
            questions: questions.map(q => ({
                question: q.question?._id,
                score: q.score
            }))
        };

        onCreate(formattedContest);
        setNewContest({
            title: '',
            description: '',
            startTime: '',
            endTime: '',
            duration: '',
            isPublic: true,
            isPublished: false,
            questions: []
        });
        setQuestions([]);
        setSelectedQuestions([]);
        setShowQuestionPanel(false);
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <div style={styles.header}>

                    <h2 style={styles.modalHeading}>Create New Contest</h2>
                    <button style={styles.removeBtn} onClick={onClose}>✕</button>
                </div>

                <div style={styles.contentWrapper}>
                    {/* LEFT SIDE – Form Inputs */}
                    <div style={styles.leftSection}>
                        {['title', 'description', 'duration'].map((field) => (
                            <div key={field} style={styles.modalField}>
                                <label style={styles.label}>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
                                {field === 'description' ? (
                                    <textarea
                                        style={styles.input}
                                        value={newContest[field]}
                                        onChange={(e) => handleChange(field, e.target.value)}
                                        rows={3}
                                    />
                                ) : (
                                    <input
                                        type={field === 'duration' ? 'number' : 'text'}
                                        style={styles.input}
                                        placeholder={field === 'duration' ? 'Enter Time in Minutes' : 'Title'}
                                        value={newContest[field]}
                                        onChange={(e) => handleChange(field, e.target.value)}
                                    />
                                )}
                            </div>
                        ))}

                        {['startTime', 'endTime'].map((field) => (
                            <div key={field} style={styles.modalField}>
                                <label style={styles.label}>{field === 'startTime' ? 'Start Time' : 'End Time'}:</label>
                                <input
                                    type="datetime-local"
                                    style={styles.input}
                                    value={toLocalDatetimeString(newContest[field])}
                                    onChange={(e) => handleChange(field, e.target.value)}
                                />
                            </div>
                        ))}

                        <div style={styles.switchGroup}>
                            <label style={styles.switchLabel}>
                                <input
                                    type="checkbox"
                                    checked={newContest.isPublic}
                                    onChange={() => handleChange('isPublic', !newContest.isPublic)}
                                />
                                <span>Public Contest</span>
                            </label>
                            <label style={styles.switchLabel}>
                                <input
                                    type="checkbox"
                                    checked={newContest.isPublished}
                                    onChange={() => handleChange('isPublished', !newContest.isPublished)}
                                />
                                <span>Publish Now</span>
                            </label>
                        </div>


                    </div>

                    {/* RIGHT SIDE – Selected Questions */}
                    <div style={styles.rightSection}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={styles.subheading}>Selected Questions</h3>
                            <h3 style={{ ...styles.subheading, marginRight: "55px" }}>Score</h3>
                        </div>

                        <div style={styles.questionList}>
                            {questions.map((entry, i) => (
                                <div key={entry.question?._id || entry?._id} style={styles.questionCard}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <strong>{i + 1}. {entry?.question?.title || entry.title}</strong>
                                        {/* <p>{" " + entry?.question?.difficulty || entry.difficulty}</p> */}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <input
                                                type="number"
                                                value={entry.score}
                                                onChange={(e) => {
                                                    const newScore = parseInt(e.target.value, 10);
                                                    setQuestions(prev =>
                                                        prev.map(q =>
                                                            q.question._id === entry.question._id ? { ...q, score: newScore } : q
                                                        )
                                                    );
                                                }}
                                                style={{
                                                    width: '60px',
                                                    background: '#111',
                                                    color: '#fff',
                                                    border: '1px solid #444',
                                                    borderRadius: '4px',
                                                    padding: '4px',
                                                    marginRight: '10px',
                                                }}
                                            />
                                            <button
                                                onClick={() => {
                                                    if (entry?.question) {
                                                        handleRemoveQuestion(entry?.question?._id);
                                                    }
                                                    else {
                                                        handleRemoveQuestion(entry._id);
                                                    }
                                                }}
                                                style={styles.removeSmallBtn}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>


                        {showQuestionPanel ? (
                            <SelectQuestionsPanel
                                problems={problems}
                                selectedQuestions={selectedQuestions}
                                onCheckboxChange={handleCheckboxChange}
                                onAddSelectedQuestions={handleAddSelectedQuestions}
                                onClose={() => setShowQuestionPanel(false)}
                            />
                        ) : <button style={{ ...styles.addBtn, marginTop: '10px' }} onClick={() => setShowQuestionPanel(true)}>
                            + Select Questions
                        </button>}
                    </div>
                </div>
                <div style={styles.footer}>
                    <button style={styles.createBtn} onClick={handleSubmit}>Create</button>
                </div>
            </div>

        </div>
    );
};

const styles = {
    contentWrapper: {
        display: 'flex',
        gap: '24px',
        flexWrap: 'wrap',
    },
    leftSection: {
        flex: 1,
        minWidth: '240px',
    },
    rightSection: {
        flex: 1,
        minWidth: '240px',
        // maxHeight: '400px',
        overflowY: 'auto',
        borderLeft: '1px solid #333',
        paddingLeft: '16px',
    },
    subheading: {
        color: '#ccc',
        fontSize: '16px',
        marginBottom: '10px',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
    },
    removeBtn: {
        background: 'transparent',
        border: 'none',
        color: '#aaa',
        fontSize: '20px',
        cursor: 'pointer',
    },
    overlay: {
        position: 'fixed',
        top: 0, left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0,0,0,0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        overflowY: 'auto',
    },
    modal: {
        backgroundColor: '#1e1e1e',
        padding: '24px',
        borderRadius: '14px',
        border: '1px solid #444',
        width: '80vw',
        // height: '90vh',
        overflowY: 'auto',
        boxShadow: '0 0 30px rgba(0,0,0,0.8)',
    },
    modalHeading: {
        fontSize: '24px',
        marginBottom: '20px',
        color: '#f1f1f1',
    },
    modalField: {
        marginBottom: '16px',
    },
    label: {
        display: 'block',
        marginBottom: '6px',
        fontWeight: '600',
        color: '#ccc',
    },
    input: {
        width: '100%',
        padding: '10px',
        borderRadius: '6px',
        border: '1px solid #555',
        backgroundColor: '#121212',
        color: '#f1f1f1',
        fontSize: '14px',
    },
    switchGroup: {
        display: 'flex',
        justifyContent: 'space-between',
        margin: '20px 0',
    },
    switchLabel: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontSize: '14px',
        color: '#ddd',
        backgroundColor: '#2a2a2a',
        padding: '6px 12px',
        borderRadius: '6px',
        border: '1px solid #444',
    },

    questionList: {
        marginBottom: '20px',
    },
    questionCard: {
        backgroundColor: '#2a2a2a',
        padding: '12px',
        borderRadius: '8px',
        marginBottom: '10px',
        borderLeft: '4px solid #3b82f6',
    },
    questionDesc: {
        fontSize: '13px',
        color: '#ccc',
        margin: '4px 0',
    },
    tagList: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '6px',
        marginTop: '6px',
    },
    tag: {
        backgroundColor: '#3b3b3b',
        color: '#fff',
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '12px',
    },
    addBtn: {
        backgroundColor: '#2563eb',
        color: '#fff',
        border: 'none',
        padding: '10px 16px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '14px',
    },
    removeSmallBtn: {
        backgroundColor: '#1e1e1e',
        color: '#fff',
        border: 'none',
        borderRadius: '50%',
        width: '24px',
        height: '24px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '14px',
        lineHeight: '0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    footer: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginTop: '20px',
    },

    createBtn: {
        backgroundColor: '#10b981', // teal green
        color: '#fff',
        border: 'none',
        padding: '12px 20px',
        borderRadius: '8px',
        fontSize: '15px',
        cursor: 'pointer',
        fontWeight: '600',
    },


};

export default CreateContestForm;
