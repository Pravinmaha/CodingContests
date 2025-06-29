import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { useFullContest } from '../contexts/FullContestContext';

const QuestionPageLayout = () => {
    const { contest, loading } = useFullContest();
    const navigate = useNavigate();
    const { questionId } = useParams(); // ⬅️ get active question id from URL
    const [timeLeft, setTimeLeft] = useState("");

    useEffect(() => {
        if (!contest || !contest.startTime || !contest.endTime) return;

        const interval = setInterval(() => {
            const now = new Date();
            const end = new Date(contest.endTime);
            const diff = end - now;

            if (diff <= 0) {
                setTimeLeft("Time's up");
                clearInterval(interval);
                return;
            }
            const days = Math.floor((diff / (1000 * 60 * 60 * 24)));
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((diff / (1000 * 60)) % 60);
            const seconds = Math.floor((diff / 1000) % 60);
            setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        }, 1000);

        return () => clearInterval(interval);
    }, [contest]);

    if (loading || !contest) return <div style={styles.loading}>Loading Contest...</div>;

    return (
        <>
            {/* Top Navbar */}
            <header style={styles.navbar}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <h2 style={styles.logo} onClick={() => navigate(`/contests/${contest._id}`)}>🔥 {contest.title}</h2>
                </div>

                {/* Question Buttons */}
                <aside style={styles.questionList}>
                    {contest.questions.map((entry, i) => {
                        const isActive = entry.question._id === questionId;
                        return (
                            <div
                                key={entry.question._id}
                                style={{
                                    ...styles.questionCard,
                                    ...(isActive ? styles.activeQuestion : {})
                                }}
                                onClick={() => {
                                    if (!isActive) {
                                        navigate(`/contests/${contest._id}/questions/${entry.question._id}`);
                                    }
                                }}
                            >
                                <span style={styles.qNumber}>Q.{i + 1}</span>
                            </div>
                        );
                    })}
                </aside>

                <div style={styles.meta}>
                    <p>⏱ </p>
                    <strong>{timeLeft}</strong>
                </div>
            </header>

            {/* Main Outlet Content */}
            <main style={styles.main}>
                <Outlet />
            </main>
        </>
    );
};

export default QuestionPageLayout;

const styles = {
    loading: {
        color: '#aaa',
        padding: '2rem',
        fontSize: '18px',
        textAlign: 'center',
    },
    navbar: {
        width: '100%',
        padding: '7px 24px',
        backgroundColor: '#1f1f1f',
        color: '#fff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        borderBottom: '1px solid #333',
    },
    logo: {
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#ffa726',
        cursor: 'pointer'
    },
    meta: {
        display: 'flex',
        gap: '10px',
        fontSize: '14px',
        color: '#ccc',
        alignItems: 'center',
        width: "150px",
    },
    questionList: {
        backgroundColor: '#181818',
        display: 'flex',
        gap: '5px',
        flexWrap: 'wrap',
        borderBottom: '1px solid #333',
    },
    questionCard: {
        padding: '12px',
        backgroundColor: '#2a2a2a',
        borderRadius: '8px',
        border: '1px solid #444',
        cursor: 'pointer',
        fontSize: '14px',
        color: '#eee',
        transition: 'background 0.2s ease',
    },
    activeQuestion: {
        backgroundColor: '#00e5ff',
        color: '#000',
        fontWeight: 'bold',
        borderColor: '#00e5ff',
    },
    qNumber: {
        fontWeight: 'bold',
    },
    main: {
        backgroundColor: '#121212',
        minHeight: 'calc(100vh - 60px)',
        color: '#f0f0f0',
    },
};
