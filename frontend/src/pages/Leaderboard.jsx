import { useParams } from 'react-router-dom';

export default function LeaderboardPage() {
  const { id } = useParams();
  const data = [
    { user: 'Alice', score: 100, time: '8:45' },
    { user: 'Bob', score: 80, time: '8:50' },
  ];

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Leaderboard for Contest {id}</h1>
      <table style={styles.table}>
        <thead>
          <tr style={styles.headerRow}>
            <th style={styles.cell}>#</th>
            <th style={styles.cell}>User</th>
            <th style={styles.cell}>Score</th>
            <th style={styles.cell}>Time</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry, idx) => (
            <tr key={idx}>
              <td style={styles.cell}>{idx + 1}</td>
              <td style={styles.cell}>{entry.user}</td>
              <td style={styles.cell}>{entry.score}</td>
              <td style={styles.cell}>{entry.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  container: {
    padding: '16px',
    fontFamily: 'Arial, sans-serif',
  },
  heading: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '16px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  headerRow: {
    backgroundColor: '#f0f0f0',
  },
  cell: {
    border: '1px solid #ccc',
    padding: '10px',
    textAlign: 'left',
  },
};
