import { useState } from 'react';
import { useAllContests } from '../contexts/AllContestsContext';

export default function AllContestsPage() {
  const [tab, setTab] = useState('upcoming');
  const { allContests, loading } = useAllContests();

  if (loading) return <div style={styles.loading}>Contests are loading...</div>;

  const now = Date.now();

  const filteredContests =
    tab === 'past'
      ? allContests.filter(
          (c) => new Date(c.endTime).getTime() + c.duration * 60000 < now
        )
      : allContests.filter(
          (c) => new Date(c.endTime).getTime() + c.duration * 60000 >= now
        );

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.heading}>🧠 Coding Contests</h1>

        <div style={styles.tabs}>
          <button
            onClick={() => setTab('upcoming')}
            style={tab === 'upcoming' ? styles.activeTab : styles.tab}
          >
            Upcoming Contests
          </button>
          <button
            onClick={() => setTab('past')}
            style={tab === 'past' ? styles.activeTab : styles.tab}
          >
            Past Contests
          </button>
        </div>

        <div style={styles.contestList}>
          {filteredContests.map((contest) => (
            <div key={contest._id} style={styles.card}>
              <div style={styles.cardHeader}>
                <h2 style={styles.cardTitle}>{contest.title}</h2>
                <a href={`/contests/${contest._id}/questions`} style={styles.viewBtn}>
                  View →
                </a>
              </div>
              <p style={styles.cardMeta}>
                📅 {new Date(contest.startTime).toLocaleString()}
              </p>
              <p style={styles.cardMeta}>⏱️ Duration: {contest.duration} mins</p>
              {contest.isPublished ? (
                <span style={styles.publishedBadge}>Published</span>
              ) : (
                <span style={styles.draftBadge}>Draft</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(to bottom, #0d0d0d, #1a1a1a)',
    color: '#f0f0f0',
    fontFamily: 'Segoe UI, sans-serif',
    padding: '40px 20px',
  },
  container: {
    maxWidth: '900px',
    margin: '0 auto',
  },
  heading: {
    fontSize: '32px',
    fontWeight: 'bold',
    marginBottom: '24px',
    color: '#ffa726',
  },
  loading: {
    padding: '2rem',
    color: '#ccc',
    textAlign: 'center',
  },
  tabs: {
    display: 'flex',
    gap: '12px',
    marginBottom: '24px',
  },
  tab: {
    padding: '10px 18px',
    backgroundColor: '#222',
    borderRadius: '20px',
    border: '1px solid #333',
    color: '#aaa',
    cursor: 'pointer',
    fontSize: '14px',
  },
  activeTab: {
    padding: '10px 18px',
    backgroundColor: '#ffa726',
    color: '#000',
    borderRadius: '20px',
    fontWeight: 'bold',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
  },
  contestList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  card: {
    backgroundColor: '#1b1b1b',
    border: '1px solid #333',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 0 12px rgba(0,0,0,0.3)',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#f5f5f5',
  },
  viewBtn: {
    backgroundColor: '#00e5ff',
    color: '#000',
    padding: '6px 12px',
    borderRadius: '6px',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '13px',
  },
  cardMeta: {
    color: '#aaa',
    marginTop: '8px',
    fontSize: '14px',
  },
  publishedBadge: {
    marginTop: '12px',
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    backgroundColor: '#10b981',
    color: '#000',
    fontWeight: 'bold',
  },
  draftBadge: {
    marginTop: '12px',
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    backgroundColor: '#f87171',
    color: '#000',
    fontWeight: 'bold',
  },
};
