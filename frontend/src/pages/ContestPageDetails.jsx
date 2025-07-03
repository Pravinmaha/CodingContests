import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { registerForContest } from '../services/contestService';
import { useFullContest } from '../contexts/FullContestContext';

export default function ContestPageDetails() {
    const { contest, loading, setRefresh } = useFullContest();
    const [isRegistered, setIsRegistered] = useState(false);
    const [timeLeftText, setTimeLeftText] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (!contest || !contest.registeredUsers) return;

        const userId = localStorage.getItem("userId");

        const isUserRegistered = contest.registeredUsers.some(
            (entry) => entry.user?._id?.toString() === userId && entry.status === "registered"
        );

        const isUserCreator = (userId === contest?.createdBy?.toString());

        setIsRegistered(isUserRegistered || isUserCreator);
    }, [contest]);



    useEffect(() => {
        if (!contest || !contest.startTime || !contest.endTime) return;

        const interval = setInterval(() => {
            const now = new Date();
            const start = new Date(contest.startTime);
            const end = new Date(contest.endTime);
            const diff = start - now;
            if (Math.abs(diff) < 1000) {
                setRefresh(prev => !prev);
            }

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
                setRefresh(prev => !prev)
                alert("Registered successfully")
            })
            .catch((err) => {
                console.log("Error registering contest!!", err)
            })
    }

    const formatDate = (date) =>
        new Intl.DateTimeFormat('en-IN', {
            dateStyle: 'medium',
            timeStyle: 'short',
            hour12: true,
        }).format(new Date(date));

    if (loading) {
        return <div style={styles.page}><div style={styles.card}>Loading contest...</div></div>;
    }


    const now = new Date();
    const hasEnded = contest && new Date(contest.endTime) < now;

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
                    {!isRegistered && !hasEnded && (
                        <button onClick={handleRegister} style={styles.registerBtn}>
                            📝 Register
                        </button>
                    )}
                </div>

                <div style={styles.description}>
                    <p>{contest.description}</p>
                </div>
            </div>

            <div style={styles.questionList}>
                {contest?.questions?.length > 0 ? (
                    <>
                        {(hasEnded || isRegistered) ? (
                            contest.questions.map((entry) => (
                                <div
                                    key={entry._id}
                                    onClick={() => {
                                        if (entry?.question?._id) {
                                            navigate(`/contests/${contest._id}/questions/${entry.question._id}`);
                                        } else {
                                            navigate(`/contests/${contest._id}/questions/${entry._id}`);
                                        }
                                    }}
                                    style={styles.questionCard}
                                >
                                    <div style={styles.questionTitle}>
                                        {entry.question?.title || entry.title}
                                    </div>
                                    <div style={styles.questionScore}>
                                        Score: {entry.score || 10}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>🚫 No questions available yet.</p>
                        )}
                    </>
                ) : (
                    <>
                        {!hasEnded && !isRegistered ? (
                            <p>🔒 Register to view contest questions</p>
                        ) : (
                            <p>🚫 No questions available.</p>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

const styles = {
    page: {
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #0e0e0e, #1a1a1a)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '60px 20px',
        fontFamily: 'Segoe UI, sans-serif',
        color: '#eee',
    },
    card: {
        background: '#1c1c1c',
        color: '#fff',
        padding: '40px',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '800px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
        marginBottom: '40px',
        transition: '0.3s ease',
    },
    title: {
        fontSize: '40px',
        fontWeight: '700',
        color: '#ffa726',
        marginBottom: '12px',
    },
    meta: {
        fontSize: '16px',
        color: '#bbb',
        display: 'flex',
        gap: '12px',
        alignItems: 'center',
        marginBottom: '28px',
    },
    dot: {
        fontSize: '18px',
        lineHeight: '0',
    },
    actions: {
        display: 'flex',
        gap: '16px',
        marginBottom: '30px',
    },
    registerBtn: {
        background: 'linear-gradient(to right, #ffcc70, #ffb74d)',
        color: '#000',
        padding: '12px 22px',
        borderRadius: '30px',
        fontWeight: 'bold',
        fontSize: '15px',
        border: 'none',
        cursor: 'pointer',
        transition: '0.3s',
    },
    startBtn: {
        background: 'linear-gradient(to right, #64ffda, #18ffff)',
        color: '#000',
        padding: '12px 22px',
        borderRadius: '30px',
        fontWeight: 'bold',
        fontSize: '15px',
        border: 'none',
        cursor: 'pointer',
        transition: '0.3s',
    },
    iconBtn: {
        backgroundColor: '#333',
        color: '#fff',
        padding: '10px',
        borderRadius: '50%',
        fontSize: '16px',
        width: '40px',
        height: '40px',
        textAlign: 'center',
        lineHeight: '20px',
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: '0.3s',
    },
    description: {
        fontSize: '17px',
        lineHeight: '1.6',
        marginTop: '12px',
        color: '#ccc',
    },
    questionList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        width: '100%',
        maxWidth: '800px',
    },
    questionCard: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#2a2a2a',
        padding: '15px 25px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        cursor: 'pointer',
        transition: '0.3s ease',
    },
    questionTitle: {
        fontSize: '18px',
        fontWeight: '600',
        color: 'rgb(46, 150, 255)',
    },
    questionScore: {
        fontSize: '16px',
        color: '#aaa',
        margin: '0 20px'
    },
    loading: {
        color: '#aaa',
        padding: '40px',
        textAlign: 'center',
    },
};

