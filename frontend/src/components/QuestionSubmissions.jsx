import React, { useEffect, useState } from 'react';

const CURRENT_USER = 'abhijitraut'; // Replace with auth context or props if available

const dummySubmissions = [
  {
    id: 'SUB123',
    language: 'python',
    status: 'Passed',
    score: 100,
    time: '2025-06-20 17:30',
    code: 'print("Hello, world!")',
    input: 'a=2, b=3',
    output: '5',
  },
  {
    id: 'SUB124',
    language: 'cpp',
    status: 'Failed',
    score: 0,
    time: '2025-06-20 17:20',
    code: '#include<iostream>\nint main() { std::cout << "Hi"; }',
    input: 'x=1, y=4',
    output: 'Error: Compilation failed',
  },
  {
    id: 'SUB125',
    language: 'cpp',
    status: 'Failed',
    score: 0,
    time: '2025-06-20 17:20',
    code: '#include<iostream>\nint main() { std::cout << "Hi"; }',
    input: 'x=1, y=4',
    output: 'Error: Compilation failed',
  },
  {
    id: 'SUB126',
    language: 'cpp',
    status: 'Failed',
    score: 0,
    time: '2025-06-20 17:20',
    code: '#include<iostream>\nint main() { std::cout << "Hi"; }',
    input: 'x=1, y=4',
    output: 'Error: Compilation failed',
  },
  {
    id: 'SUB127',
    language: 'cpp',
    status: 'Failed',
    score: 0,
    time: '2025-06-20 17:20',
    code: '#include<iostream>\nint main() { std::cout << "Hi"; }',
    input: 'x=1, y=4',
    output: 'Error: Compilation failed',
  },
  {
    id: 'SUB128',
    language: 'cpp',
    status: 'Failed',
    score: 0,
    time: '2025-06-20 17:20',
    code: '#include<iostream>\nint main() { std::cout << "Hi"; }',
    input: 'x=1, y=4',
    output: 'Error: Compilation failed',
  },
];

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
  },
  td: {
    padding: '12px',
    fontSize: '14px',
    textAlign: 'center',
    borderBottom: '1px solid #444',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  rowHover: {
    backgroundColor: '#2b2b2b',
  },
  statusPassed: {
    color: '#28a745',
    fontWeight: '600',
  },
  statusFailed: {
    color: '#dc3545',
    fontWeight: '600',
  },
  detailsBox: {
    marginTop: '1.5rem',
    padding: '1rem',
    borderRadius: '8px',
    backgroundColor: '#121212',
    border: '1px solid #333',
    fontSize: '14px',
    whiteSpace: 'pre-wrap',
    color: '#ccc',
  },
  label: {
    fontWeight: '600',
    marginBottom: '4px',
    color: '#999',
  },
  section: {
    marginBottom: '1rem',
  },
};

const QuestionSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  useEffect(() => {
    // Simulate API filtering by user
    const userSubmissions = dummySubmissions.filter((s) => s.user === CURRENT_USER);
    setSubmissions(userSubmissions);
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>📝 Your Submissions</h2>

      {submissions.length === 0 ? (
        <p>No submissions yet.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Language</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Score</th>
              <th style={styles.th}>Submitted At</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((s, i) => (
              <tr
                key={i}
                style={selectedSubmission?.id === s.id ? styles.rowHover : {}}
                onClick={() => setSelectedSubmission(s)}
              >
                <td style={styles.td}>{s.id}</td>
                <td style={styles.td}>{s.language}</td>
                <td
                  style={{
                    ...styles.td,
                    ...(s.status === 'Passed' ? styles.statusPassed : styles.statusFailed),
                  }}
                >
                  {s.status}
                </td>
                <td style={styles.td}>{s.score}</td>
                <td style={styles.td}>{s.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedSubmission && (
        <div style={styles.detailsBox}>
          <div style={styles.section}>
            <div style={styles.label}>🔠 Code:</div>
            <pre>{selectedSubmission.code}</pre>
          </div>
          <div style={styles.section}>
            <div style={styles.label}>📥 Input:</div>
            <pre>{selectedSubmission.input}</pre>
          </div>
          <div style={styles.section}>
            <div style={styles.label}>📤 Output:</div>
            <pre>{selectedSubmission.output}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionSubmissions;
