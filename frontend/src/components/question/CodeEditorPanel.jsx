import React, { useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';

const CodeEditorPanel = ({
    handleTabChange,
    languages,
    handleLangChange,
    activeCodeTab,
    activeLang,
    currentCode,
    setCurrentCode,
    handleSubmit,
    openGuidlines
}) => {
    const editorRef = useRef(null);


    const mapLangToMonaco = (lang) => {
        switch (lang) {
            case 'js': return 'javascript';
            case 'cpp': return 'cpp';
            case 'c': return 'c';
            case 'python': return 'python';
            case 'java': return 'java';
            default: return 'plaintext';
        }
    };

    // Optional: focus on the editor when tab or lang changes
    useEffect(() => {
        if (editorRef.current) {
            editorRef.current.focus();
        }
    }, [activeCodeTab, activeLang]);

    return (
        <div style={styles.wrapper}>
            <h3 style={styles.sectionHeading}>🧠 Code Editor</h3>

            {/* Tab Switcher */}
            <div style={styles.tabLineBar}>
                {['runner', 'reference', 'default', 'submit'].map(tab => (
                    <div key={tab} style={styles.tabWrapper}>
                        <button
                            onClick={() => handleTabChange(tab)}
                            style={activeCodeTab === tab ? styles.activeTab : styles.tab}
                        >
                            <p>{tab.charAt(0).toUpperCase() + tab.slice(1)} Code</p>
                        </button>
                        <div style={styles.circle} onClick={() => openGuidlines(tab)}>?</div>
                    </div>
                ))}
            </div>

            {/* Language Switcher */}
            <div style={styles.tabBar}>
                {languages.map(lang => (
                    <button
                        key={lang}
                        onClick={() => handleLangChange(lang)}
                        style={activeLang === lang ? { ...styles.tabPill, ...styles.activeTabPill } : styles.tabPill}
                    >
                        {lang}
                    </button>
                ))}
            </div>

            {/* Current Selection Label */}
            <div style={styles.infoText}>
                ✍️ Editing: <strong>{activeCodeTab}</strong> in <strong>{activeLang}</strong>
            </div>

            {/* Monaco Editor */}
            <div style={styles.editorContainer}>
                <Editor
                    key={`${activeLang}-${activeCodeTab}`}
                    height="70vh"
                    theme="vs-dark"
                    language={mapLangToMonaco(activeLang)}
                    value={currentCode}
                    onChange={(value) => setCurrentCode(value || '')}
                    options={{
                        fontSize: 14,
                        minimap: { enabled: false },
                        automaticLayout: true,
                        wordWrap: 'on',
                    }}
                />
                {/* <button onClick={() => editorRef.current?.getAction('editor.action.formatDocument')?.run()} style={styles.formatBtn}>
                    {"{ }"}
                </button> */}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>

                <button onClick={handleSubmit} style={styles.submitBtn}>✅ Submit Problem</button>
            </div>

        </div>
    );
};

export default CodeEditorPanel;

const styles = {
    wrapper: {
        padding: 20,
        width: '100%',
        fontFamily: 'sans-serif',
        color: '#e0f7fa',
    },
    sectionHeading: {
        fontSize: 24,
        color: '#4dd0e1',
        fontWeight: 'bold',
        marginBottom: 20,
    },
    tabLineBar: {
        display: 'flex',
        gap: 60,
        borderBottom: '2px solid #263238',
        marginBottom: 12,
        paddingBottom: 4,
    },
    tabWrapper: {
        display: 'flex',
    },
    circle: {
        backgroundColor: 'rgb(36, 36, 36)',
        padding: "8px",
        width: "20px",
        height: "20px",
        margin: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: "14px",
        borderRadius: "50%",
        border: '2px solid yellow',
        color: 'yellow',
        cursor: 'pointer'

    },
    tab: {
        padding: '8px 40px',
        background: 'transparent',
        border: 'none',
        borderBottom: '2px solid transparent',
        color: '#90caf9',
        fontSize: 14,
        cursor: 'pointer',
        transition: '0.2s',
    },
    activeTab: {
        padding: '8px 40px',
        background: 'transparent',
        border: 'none',
        borderBottom: '2px solid #00e5ff',
        color: '#00e5ff',
        fontWeight: 600,
        fontSize: 14,
        cursor: 'pointer',
    },
    tabBar: {
        display: 'flex',
        gap: 12,
        marginBottom: 12,
        flexWrap: 'wrap',
    },
    tabPill: {
        padding: '6px 16px',
        borderRadius: 9999,
        border: '1px solid #37474f',
        backgroundColor: '#1a1f27',
        color: '#e0f7fa',
        fontSize: 14,
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
    },
    activeTabPill: {
        backgroundColor: '#00e5ff',
        color: '#000',
        border: '1px solid #00e5ff',
        fontWeight: 'bold',
    },
    editorContainer: {
        position: 'relative',
        marginTop: '10px',
        border: '1px solid #263238',
        borderRadius: '6px',
        overflow: 'hidden',
        width: '100%',
    },
    infoText: {
        marginBottom: 10,
        fontSize: 14,
        color: '#b0bec5',
    },
    formatBtn: {
        border: 'none',
        borderRadius: 14,
        padding: "8px",
        background: "rgb(255, 255, 255)",
        cursor: 'pointer',
        fontWeight: '600',
        fontSize: '20px',
        position: 'absolute',
        top: '10px',
        right: '10px',
        zIndex: '1000'
    },

    submitBtn: {
        background: '#26c6da',
        color: '#000',
        padding: '12px 20px',
        border: 'none',
        borderRadius: 6,
        fontSize: 16,
        marginTop: 30,
        cursor: 'pointer',
        fontWeight: 'bold',
    },
};
