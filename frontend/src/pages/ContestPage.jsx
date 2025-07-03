import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getContest, registerForContest } from '../services/contestService';

export default function ContestInfoPage() {
  const { contestId } = useParams();
  const [contest, setContest] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [timeLeftText, setTimeLeftText] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getContest(contestId)
      .then(data => {
        setContest(data)
        const userId = localStorage.getItem("userId");
        if (data?.registeredUsers?.some(
          (entry) => entry.user === userId && entry.status === "registered"
        ) || userId === data.createdBy.toString()) {
          setIsRegistered(true);
        }
      })
      .catch(err => console.error('Error fetching contest details', err));
  }, [contestId]);

  useEffect(() => {
    if (!contest) return;

    const interval = setInterval(() => {
      const now = new Date();
      const start = new Date(contest.startTime);
      const end = new Date(contest.endTime);
      const diff = start - now;

      if (diff <= 0) {
        const timeRemaining = end - now;
        if (timeRemaining <= 0) {
          setTimeLeftText("Contest has Ended");
          return;
        }
        const hours = Math.floor((timeRemaining / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((timeRemaining / (1000 * 60)) % 60);
        const seconds = Math.floor((timeRemaining / 1000) % 60);
        setTimeLeftText(`⏳ Ongoing: Ends in ${hours}h ${minutes}m ${seconds}s`);
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeftText(`🕒 Starts in ${days}d ${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [contest]);

  const handleRegister = () => {
    registerForContest(contest._id)
      .then((data) => {
        setIsRegistered(true);
        alert("Registered successfully")
      })
      .catch((err) => {
        console.log("Error registering contest!!", err)
      })
  }

  const joinContest = async () => {
    const now = new Date();
    const start = new Date(contest.startTime);
    const end = new Date(contest.endTime);

    const userId = localStorage.getItem("userId");

    if (userId === contest.createdBy.toString() || (now >= start
      // && now <= end
    )) {
      try {
        navigate(`/contests/${contest._id}/questions/`)
      } catch (err) {
        console.error("Error joining contest:", err);
        alert(err.message)
      }
    } else {
      alert("You can only join the contest during the active time window.");
    }
  };

  const formatDate = (date) =>
    new Intl.DateTimeFormat('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
      hour12: true,
    }).format(new Date(date));

  if (!contest) {
    return <div style={styles.loading}>Loading contest...</div>;
  }



  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>🔥 {contest.title}</h1>
        <div style={styles.meta}>
          <span>{formatDate(contest.startTime)}</span>
          <span style={styles.dot}>•</span>
          <span>{timeLeftText}</span>
        </div>

        <div style={styles.actions}>
          {isRegistered ?
            <button onClick={joinContest} style={styles.startBtn}>
              {localStorage.getItem("userId") === contest.createdBy.toString() ? "Preview Contest" :
                <>{new Date() > new Date(contest.endTime) ? "🚀 Practice" : "🚀 Join Contest"}</>
              }</button>
            : <button onClick={handleRegister} style={styles.registerBtn}>
              📝 Register
            </button>}
          <a href={`/contests/${contestId}/leaderboard`} style={styles.iconBtn}>LeaderBoard</a>
        </div>

        <div style={styles.description}>
          <p>{contest.description}</p>
        </div>

      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(to bottom right, #0e0e0e, #1a1a1a)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: '60px 20px',
    fontFamily: 'Segoe UI, sans-serif',
  },
  card: {
    background: '#111',
    color: '#eee',
    padding: '40px',
    borderRadius: '16px',
    maxWidth: '800px',
    width: '100%',
    boxShadow: '0 0 24px rgba(0,0,0,0.6)',
  },
  title: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#ffa726',
    marginBottom: '8px',
  },
  meta: {
    fontSize: '15px',
    color: '#ccc',
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    marginBottom: '24px',
  },
  dot: {
    fontSize: '18px',
    lineHeight: '0',
  },
  actions: {
    display: 'flex',
    gap: '12px',
    marginBottom: '24px',
  },
  registerBtn: {
    backgroundColor: '#ffa726',
    color: '#000',
    padding: '10px 18px',
    borderRadius: '30px',
    fontWeight: 'bold',
    fontSize: '14px',
    textDecoration: 'none',
    boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
  },
  iconBtn: {
    backgroundColor: '#222',
    color: '#fff',
    padding: '10px',
    borderRadius: '50%',
    fontSize: '16px',
    textDecoration: 'none',
    width: '40px',
    height: '40px',
    textAlign: 'center',
    lineHeight: '20px',
  },
  description: {
    fontSize: '16px',
    lineHeight: '1.6',
    marginBottom: '24px',
  },
  prizeBox: {
    backgroundColor: '#181818',
    padding: '20px',
    borderRadius: '10px',
    marginBottom: '30px',
    border: '1px solid #333',
  },
  subheading: {
    fontSize: '18px',
    marginBottom: '10px',
    color: '#ffd700',
  },
  prizeList: {
    fontSize: '14px',
    paddingLeft: '20px',
    color: '#ccc',
  },
  startBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    color: '#000',
    padding: '14px 24px',
    borderRadius: '50px',
    fontSize: '16px',
    border: "none",
    fontWeight: 'bold',
    textDecoration: 'none',
    display: 'inline-block',
    textAlign: 'center',
  },
  loading: {
    color: '#888',
    padding: '40px',
    textAlign: 'center',
  },
};
