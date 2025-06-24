import React from 'react';

const RegisteredUsersTable = ({ users }) => {
  if (!users || users.length === 0) {
    return <p style={styles.emptyText}>No users registered yet.</p>;
  }

  return (
    <div style={styles.section}>
      <h2 style={styles.subheading}>Registered Users</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Email ID</th>
            <th style={styles.th}>Username</th>
            <th style={styles.th}>Status</th>
          </tr>
        </thead>
        <tbody>
          {users.map((entry, i) => (
            <tr key={i}>
              <td style={{ ...styles.td, fontFamily: 'monospace' }}>{entry.user?.email}</td>
              <td style={styles.td}>{entry.user?.name}</td>
              <td style={styles.td}>{entry.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  section: {
    marginBottom: '40px',
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
  emptyText: {
    color: '#aaa',
    fontStyle: 'italic',
    padding: '10px',
  },
};

export default RegisteredUsersTable;
