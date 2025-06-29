import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSubmissions } from '../contexts/SubmissionContext';

const styles = {
  container: {
    padding: '1.5rem',
    backgroundColor: '#1a1a1a',
    borderRadius: '12px',
    boxShadow: '0 4px 14px rgba(0,0,0,0.4)',
    color: '#ddd',
    fontFamily: 'Segoe UI, sans-serif',
  },
  heading: {
    fontSize: '22px',
    fontWeight: '600',
    marginBottom: '1rem',
    borderBottom: '2px solid #333',
    paddingBottom: '0.5rem',
    color: '#fff',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '1rem',
  },
  th: {
    backgroundColor: '#333',
    color: '#fff',
    padding: '10px',
    fontWeight: '600',
    fontSize: '14px',
    textAlign: 'left',
  },
  td: {
    padding: '12px',
    fontSize: '14px',
    borderBottom: '1px solid #444',
    transition: 'background 0.2s',
    cursor: 'pointer',
  },
  rowHover: {
    backgroundColor: '#2a2a2a',
  },
  statusPassed: {
    color: '#28a745',
    fontWeight: '600',
  },
  statusFailed: {
    color: '#dc3545',
    fontWeight: '600',
  },
};

const formatDate = (isoDate) => {
  const date = new Date(isoDate);
  return date.toLocaleString();
};

const QuestionSubmissions = () => {

  const { submissions, loading } = useSubmissions();
  const [selectedId, setSelectedId] = useState(null);
  const navigate = useNavigate();

  if (loading) return <>Loding submissions.....</>


  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>📝 Your Submissions</h2>

      {submissions?.length === 0 ? (
        <p>No submissions yet.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Language</th>
              <th style={styles.th}>Submitted At</th>
            </tr>
          </thead>
          <tbody>
            {submissions?.length > 0 && submissions?.map((s) => (
              <tr
                key={s._id}
                style={selectedId === s._id ? styles.rowHover : {}}
                onClick={() => {
                  setSelectedId(s._id);
                  navigate(`${s._id}`);
                }}
              >
                <td
                  style={{
                    ...styles.td,
                    ...(s.verdict === 'Accepted' ? styles.statusPassed : styles.statusFailed),
                  }}
                >
                  {s.verdict}
                </td>
                <td style={styles.td}>{s.language}</td>
                <td style={styles.td}>{formatDate(s.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Outlet />
    </div>
  );
};

export default QuestionSubmissions;
