import React, { useEffect, useState } from 'react';
import CreateContestForm from '../components/CreateContestForm';
import { createContest } from '../services/contestService';
import { useMyContests } from '../contexts/ContestContext';

const Contests = () => {
  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const { contests: data, loading } = useMyContests();
  const [contests, setContests] = useState([]);

  useEffect(() => {
    if (data?.length) {
      const sorted = [...data].sort(
        (a, b) => new Date(b.startTime) - new Date(a.startTime)
      );
      setContests(sorted);
    } else {
      setContests([]);
    }
  }, [data]);

  const handleCreateContest = async (newContest) => {
    try {
      const created = await createContest(newContest);
      setContests(prev => [created, ...prev]);
    } catch (err) {
      console.error('Error creating contest:', err);
    } finally {
      setShowCreatePopup(false);
    }
  };

  if (loading) return <div style={{ color: '#ccc', padding: '1rem' }}>Contests are loading...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.topBar}>
        <h1 style={styles.heading}>All Contests</h1>
        <button style={styles.createBtn} onClick={() => setShowCreatePopup(true)}>
          + Create New Contest
        </button>
      </div>

      {contests.length === 0 ? (
        <div style={{ marginTop: '20px', color: '#aaa' }}>No contests available.</div>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Title</th>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Duration</th>
            </tr>
          </thead>
          <tbody>
            {contests.map((contest) => (
              <tr key={contest._id} style={styles.tr}>
                <td style={styles.td}>
                  <a href={`/admin/contests/${contest._id}`} style={styles.viewBtn}>
                    {contest.title}
                  </a>
                </td>
                <td style={styles.td}>
                  {new Date(contest.startTime).toLocaleString('en-IN', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </td>
                <td style={styles.td}>{contest.duration} mins</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showCreatePopup && (
        <CreateContestForm
          onClose={() => setShowCreatePopup(false)}
          onCreate={handleCreateContest}
        />
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#121212',
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif',
    color: '#f1f1f1',
  },
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  heading: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#e0e0e0',
  },
  createBtn: {
    backgroundColor: '#10b981',
    color: '#fff',
    border: 'none',
    padding: '10px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#1e1e1e',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  th: {
    textAlign: 'left',
    padding: '12px 16px',
    backgroundColor: '#2c2c2c',
    color: '#f9f9f9',
    fontSize: '14px',
    borderBottom: '1px solid #444',
  },
  td: {
    padding: '12px 16px',
    borderBottom: '1px solid #333',
    color: '#d0d0d0',
    fontSize: '14px',
  },
  tr: {
    transition: 'background 0.2s ease-in-out',
  },
  viewBtn: {
    color: 'rgb(38, 132, 255)',
    textDecoration: 'none',
    fontSize: '14px',
  },
};

export default Contests;
