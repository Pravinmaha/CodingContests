import React from 'react';

const SelectQuestionsPanel = ({
    problems,
    selectedQuestionIds,
    onCheckboxChange,
    onAddSelectedQuestions,
    onClose,
}) => {
    return (
        <div style={styles.popup}>
            <div style={styles.popupHeader}>
                <h3 style={{ margin: 0 }}>📘 Select Questions</h3>
                <button style={styles.popupCloseBtn} onClick={onClose}>✕</button>
            </div>

            <div style={styles.popupList}>
                {problems?.map(q => (
                    <div key={q._id} style={styles.popupQuestionItem}>
                        <div style={styles.customCheckboxWrapper}>
                            <input
                                type="checkbox"
                                checked={selectedQuestionIds.includes(q._id)}
                                onChange={() => onCheckboxChange(q._id)}
                                style={styles.customCheckbox}
                            />
                            <div style={styles.customCheckboxCircle}>
                                {selectedQuestionIds.includes(q._id) && <div style={styles.checkmark}></div>}
                            </div>
                        </div>
                        <div style={styles.questionContent}>
                            <div style={styles.questionTitleRow}>
                                <span style={styles.questionTitle}>{q.title}</span>
                                <span style={styles.difficultyTag[q.difficulty.toLowerCase()]}>{q.difficulty}</span>
                            </div>
                            <p style={styles.description}>{q.description || 'No description provided.'}</p>
                            <div style={styles.tagContainer}>
                                {q.tags?.map((tag, idx) => (
                                    <span key={idx} style={styles.tag}>{tag}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div style={styles.popupActions}>
                <button style={styles.addBtn} onClick={onAddSelectedQuestions}>Add Selected</button>
            </div>
        </div>
    );
};

const styles = {
    popup: {
        backgroundColor: '#1e1e1e',
        padding: '20px',
        borderRadius: '12px',
        border: '1px solid #444',
        marginTop: '20px',
        boxShadow: '0 0 10px rgba(0,0,0,0.5)',
        height: 'fit-content'
    },
    popupHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
    },
    popupCloseBtn: {
        background: 'transparent',
        border: 'none',
        color: '#aaa',
        fontSize: '20px',
        cursor: 'pointer',
    },
    popupList: {
        maxHeight: '300px',
        overflowY: 'auto',
        marginBottom: '16px',
        paddingRight: '4px',
    },
    popupQuestionItem: {
        display: 'flex',
        gap: '12px',
        backgroundColor: '#2a2a2a',
        borderRadius: '8px',
        padding: '12px',
        marginBottom: '12px',
        color: '#e2e2e2',
    },
    checkbox: {
        transform: 'scale(1.3)',
        marginTop: '6px',
        cursor: 'pointer',
    },
    questionContent: {
        flex: 1,
    },
    questionTitleRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '6px',
    },
    questionTitle: {
        fontSize: '16px',
        fontWeight: 'bold',
    },
    description: {
        fontSize: '13px',
        color: '#ccc',
        marginBottom: '8px',
    },
    tagContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '6px',
    },
    tag: {
        backgroundColor: '#3b3b3b',
        color: '#ddd',
        fontSize: '12px',
        padding: '4px 8px',
        borderRadius: '4px',
    },
    popupActions: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '10px',
    },
    addBtn: {
        backgroundColor: '#2563eb',
        color: '#fff',
        border: 'none',
        padding: '8px 14px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
    },
    removeBtn: {
        backgroundColor: '#ef4444',
        color: '#fff',
        border: 'none',
        padding: '6px 10px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '13px',
    },
    difficultyTag: {
        easy: {
            backgroundColor: '#16a34a',
            color: '#fff',
            padding: '2px 6px',
            fontSize: '12px',
            borderRadius: '4px',
        },
        medium: {
            backgroundColor: '#f59e0b',
            color: '#fff',
            padding: '2px 6px',
            fontSize: '12px',
            borderRadius: '4px',
        },
        hard: {
            backgroundColor: '#dc2626',
            color: '#fff',
            padding: '2px 6px',
            fontSize: '12px',
            borderRadius: '4px',
        },
    },
    customCheckboxWrapper: {
        position: 'relative',
        width: '20px',
        height: '20px',
        minWidth: '20px',
    },

    customCheckbox: {
        opacity: 0,
        position: 'absolute',
        cursor: 'pointer',
        width: '100%',
        height: '100%',
        margin: 0,
    },

    customCheckboxCircle: {
        width: '24px',
        height: '24px',
        borderRadius: '50%',
        backgroundColor: '#333',
        border: '2px solid #666',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },

    checkmark: {
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        backgroundColor: 'rgb(0, 89, 255)', // greenish
    },

};


export default SelectQuestionsPanel;
