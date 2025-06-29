import React, { useState } from 'react';
import { suspendUser, unsuspendUser } from '../services/contestService';

const RegisteredUsersTable = ({ usersData, contestId }) => {
  const [loadingUserId, setLoadingUserId] = useState(null); // Track which user's action is in progress

  const [users, setUsers] = useState(usersData);

  if (!users || users.length === 0) {
    return <p style={styles.emptyText}>No users registered yet.</p>;
  }

  const handleToggle = async (userId, currentStatus) => {
    const newStatus =
      currentStatus === 'registered' || currentStatus === 'unsuspended'
        ? 'suspended'
        : 'unsuspended';

    setLoadingUserId(userId); // Show loader for that user

    try {
      if (newStatus === 'suspended') {
        await suspendUser(contestId, userId);
      } else {
        await unsuspendUser(contestId, userId);
      }
      setUsers((prevUsers) =>
        prevUsers.map((entry) =>
          entry.user._id === userId
            ? { ...entry, status: newStatus }
            : entry
        )
      );


      // If you want to update UI status instantly, you can emit a callback or refetch parent data
    } catch (error) {
      console.error('Error updating user status:', error.message);
      alert('Failed to update user status.');
    } finally {
      setLoadingUserId(null); // Reset loading
    }
  };

  return (
    <div style={styles.section}>
      <h2 style={styles.subheading}>Registered Users</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Email ID</th>
            <th style={styles.th}>Username</th>
            {/* <th style={styles.th}>Status</th> */}
            <th style={styles.th}>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map(({ user, status }, i) => {
            const isActive = status === 'registered' || status === 'unsuspended';
            const isLoading = loadingUserId === user?._id;

            return (
              <tr key={i} style={styles.row}>
                <td style={{ ...styles.td, fontFamily: 'monospace' }}>{user?.email}</td>
                <td style={styles.td}>{user?.name}</td>
                {/* <td style={styles.td}>
                  <span
                    style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      backgroundColor: isActive ? '#28a745' : '#dc3545',
                      color: '#fff',
                      fontSize: '12px',
                      fontWeight: 'bold',
                    }}
                  >
                    {isActive ? 'Active' : 'Restricted'}
                  </span>
                </td> */}
                <td style={styles.td}>
                  <button
                    onClick={() => handleToggle(user?._id, status)}
                    disabled={isLoading}
                    style={{
                      padding: '6px 10px',
                      backgroundColor: isActive ? '#dc3545' : '#28a745',
                      border: 'none',
                      borderRadius: '4px',
                      color: '#fff',
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      fontSize: '13px',
                      opacity: isLoading ? 0.6 : 1,
                    }}
                  >
                    {isLoading
                      ? 'Processing...'
                      : isActive
                        ? 'Restrict'
                        : 'Unrestrict'}
                  </button>
                </td>
              </tr>
            );
          })}
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
  row: {
    transition: 'background 0.3s ease',
  },
  emptyText: {
    color: '#aaa',
    fontStyle: 'italic',
    padding: '10px',
  },
};

export default RegisteredUsersTable;
