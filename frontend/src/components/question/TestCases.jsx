import React from 'react'

const TestCases = ({ openGuidlines, examples, updateExamples, removeExample, setExamples, testCases, updateTestCases, removeTestCase, setTestCases }) => {
    return (
        <>
            <div style={styles.headerWrapper}>
                <h3 style={styles.sectionHeading}>📌 Examples</h3>
                <div style={styles.circle} onClick={() => openGuidlines("examples")}>?</div>
            </div>

            {examples.map((ex, i) => (
                <div key={i} style={styles.card}>
                    <textarea placeholder="Input" style={styles.input} value={ex.input} onChange={e => updateExamples(i, 'input', e.target.value)} />
                    <textarea placeholder="Output" style={styles.input} value={ex.output} onChange={e => updateExamples(i, 'output', e.target.value)} />
                    <textarea placeholder="Explanation" style={styles.input} value={ex.explanation} onChange={e => updateExamples(i, 'explanation', e.target.value)} />
                    {examples.length > 1 && <button style={styles.removeBtn} onClick={() => removeExample(i)}>Remove</button>}
                </div>
            ))}
            <button onClick={() => setExamples(ex => [...ex, { input: '', output: '', explanation: '' }])} style={styles.addBtn}>➕ Add Example</button>

            <div style={styles.headerWrapper}>
                <h3 style={styles.sectionHeading}>🧪 Test Cases</h3>
                <div style={styles.circle} onClick={() => openGuidlines("testCases")}>?</div>
            </div>
            {testCases.map((tc, i) => (
                <div key={i} style={styles.card}>
                    <div style={{ display: 'flex', gap: 10 }}>
                        <textarea placeholder="Input" style={{ ...styles.textarea, flex: 1 }} value={tc.input} onChange={e => updateTestCases(i, 'input', e.target.value)} />
                        <textarea placeholder="Output" style={{ ...styles.textarea, flex: 1 }} value={tc.output} onChange={e => updateTestCases(i, 'output', e.target.value)} />
                    </div>
                    {testCases.length > 1 && <button style={styles.removeBtn} onClick={() => removeTestCase(i)}>Remove</button>}
                </div>
            ))}
            <button onClick={() => setTestCases(tc => [...tc, { input: '', output: '' }])} style={styles.addBtn}>➕ Add Test Case</button>
        </>
    )
}

export default TestCases;

const styles = {
    headerWrapper: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: "center",
        padding: "0 25px 0 0",
        margin: "20px 0"
    },
    sectionHeading: { fontSize: 20, color: '#80deea', fontWeight: 600 },
    circle: {
        backgroundColor: 'rgb(36, 36, 36)',
        padding: "10px",
        width: "30px",
        height: "30px",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: "20px",
        borderRadius: "50%",
        border: '2px solid yellow',
        color: 'yellow',
        cursor: 'pointer'

    },
    card: { border: '1px solid #263238', padding: 16, borderRadius: 8, backgroundColor: '#151c25', marginTop: 10 },
    textarea: { width: '100%', margin: '8px 0', padding: 10, borderRadius: 6, fontSize: 15, border: '1px solid #37474f', backgroundColor: '#1c232b', color: '#e0f7fa' },
    input: { width: '100%', margin: '8px 0', padding: 10, borderRadius: 6, border: '1px solid #37474f', backgroundColor: '#1c232b', color: '#e0f7fa', fontSize: 15 },
    removeBtn: { background: '#ef5350', color: '#fff', padding: '6px 10px', border: 'none', borderRadius: 6, marginTop: 10, cursor: 'pointer' },
    addBtn: { background: '#4fc3f7', color: '#000', padding: '8px 14px', border: 'none', borderRadius: 6, marginTop: 10, cursor: 'pointer' },

}