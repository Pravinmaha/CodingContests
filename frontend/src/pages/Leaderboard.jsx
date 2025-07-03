import React, { useEffect, useState } from 'react';
import { getLeaderboard } from '../services/leaderboardService';
import { useParams } from 'react-router-dom';

const LeaderboardTable = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [questionIds, setQuestionIds] = useState([]);
  const { contestId } = useParams();

  const fetchData = async () => {
    const data = await getLeaderboard(contestId);
    const qSet = new Set();
    data?.forEach(entry => {
      Object.keys(entry.questions || {}).forEach(qid => qSet.add(qid));
    });
    setQuestionIds([...qSet]);
    setLeaderboard(data);
  };

  useEffect(() => {
    fetchData();
  }, [contestId]);

  const formatTime = (totalSeconds) => {
    const min = Math.floor(totalSeconds / 60);
    const sec = totalSeconds % 60;
    return `${min}m ${sec}s`;
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>🏆 Contest Leaderboard</h2>
      <div style={{ overflowX: 'auto' }}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Rank</th>
              <th style={styles.th}>User</th>
              <th style={styles.th}>Score</th>
              <th style={styles.th}>Time</th>
              {questionIds.map((qid, index) => (
                <th key={qid} style={styles.th}>Q{index + 1}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry, idx) => (
              <tr key={idx} style={idx % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                <td style={styles.td}>{idx + 1}</td>
                <td style={styles.td}>{entry.user}</td>
                <td style={styles.td}>{entry.totalScore}</td>
                <td style={styles.td}>{formatTime(entry.totalTime)}</td>
                {questionIds.map((qid) => {
                  const q = entry.questions[qid];
                  return (
                    <td key={qid} style={styles.td}>
                      {q?.accepted ? (
                        <div
                          style={styles.codeTooltip}
                          title={q.acceptedCode}
                        >
                          {formatTime(q.time)}<br />
                          <small style={{ color: '#ccc' }}>+{q.penaltyCount * 5}min</small>
                        </div>
                      ) : (
                        <span style={styles.unattempted}>–</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// 🔥 Dark Mode Styles
const styles = {
  container: {
    backgroundColor: '#121212',
    color: '#eee',
    padding: '2rem',
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif',
  },
  heading: {
    marginBottom: '1rem',
    fontSize: '1.8rem',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#00d8ff',
  },
  table: {
    borderCollapse: 'collapse',
    width: '100%',
    backgroundColor: '#1e1e1e',
  },
  th: {
    border: '1px solid #333',
    padding: '12px',
    backgroundColor: '#2c2c2c',
    fontWeight: 'bold',
    color: '#00d8ff',
    textAlign: 'center',
  },
  td: {
    border: '1px solid #333',
    padding: '10px',
    textAlign: 'center',
    whiteSpace: 'nowrap',
    fontSize: '0.95rem',
  },
  rowEven: {
    backgroundColor: '#1e1e1e',
  },
  rowOdd: {
    backgroundColor: '#252525',
  },
  codeTooltip: {
    cursor: 'pointer',
    color: '#66ff99',
    fontWeight: 'bold',
  },
  unattempted: {
    color: '#666',
    fontStyle: 'italic',
  },
};

export default LeaderboardTable;
