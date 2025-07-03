import React from 'react'

const tagOptions = ['Array', 'HashMap', 'String', 'DP', 'Graph', 'Math', 'Greedy'];

const BasicDetails = ({ title, setTitle, description, setDescription, difficulty, setDifficulty, showDropdown, setShowDropdown, difficulties, showTagDropdown, setShowTagDropdown, selectedTags, setSelectedTags, constraints, setConstraints }) => {
    return (
        <>
            <h3 style={styles.sectionHeading}>Title</h3>
            <input placeholder="Problem Title" style={styles.input} value={title} onChange={e => setTitle(e.target.value)} />
            <h3 style={styles.sectionHeading}>Description</h3>
            <textarea placeholder="Problem Description" style={styles.textarea} value={description} onChange={e => setDescription(e.target.value)} />

            <h3 style={styles.sectionHeading}>⚙️ Difficulty</h3>
            <div style={{ position: 'relative' }}>
                <div onClick={() => setShowDropdown(d => !d)} style={{ ...styles.input, cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: difficulties.find(d => d.value === difficulty).color }} />
                        {difficulty}
                    </span>
                    <span>▼</span>
                </div>
                {showDropdown && (
                    <div style={styles.dropdownMenu}>
                        {difficulties.map(d => (
                            <div key={d.value} onClick={() => { setDifficulty(d.value); setShowDropdown(false); }} style={styles.dropdownItem}>
                                <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: d.color }} /> {d.value}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <h3 style={styles.sectionHeading}>⚙️ Tags</h3>
            <div style={{ position: 'relative' }}>
                <div onClick={() => setShowTagDropdown(t => !t)} style={{ ...styles.input, cursor: 'pointer', minHeight: 50, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {selectedTags.length ? selectedTags.map(t => <div key={t} style={styles.tagPill}>{t} <span onClick={e => { e.stopPropagation(); setSelectedTags(ts => ts.filter(x => x !== t)); }}>×</span></div>)
                        : <span style={{ color: '#777' }}>Select Tags...</span>}
                </div>
                {showTagDropdown && (
                    <div style={styles.tagMenu}>
                        {tagOptions.map(tag => {
                            const sel = selectedTags.includes(tag);
                            return <div key={tag} onClick={() => setSelectedTags(ts => sel ? ts.filter(x => x !== tag) : [...ts, tag])} style={sel ? styles.tagItemSelected : styles.tagItem}>{tag}</div>;
                        })}
                    </div>
                )}
            </div>

            <h3 style={styles.sectionHeading}>📍 Constraints</h3>
            <textarea placeholder="Constraints (e.g., 1 ≤ n ≤ 10^5)" style={styles.textarea} value={constraints} onChange={e => setConstraints(e.target.value)} />
        </>
    )
}

export default BasicDetails;

const styles = {
    sectionHeading: { fontSize: 20, color: '#80deea', fontWeight: 600 },
    input: { width: '100%', margin: '8px 0', padding: 10, borderRadius: 6, border: '1px solid #37474f', backgroundColor: '#1c232b', color: '#e0f7fa', fontSize: 15 },
    textarea: { width: '100%', margin: '8px 0', padding: 10, borderRadius: 6, fontSize: 15, border: '1px solid #37474f', backgroundColor: '#1c232b', color: '#e0f7fa' },
    dropdownMenu: { position: 'absolute', top: '100%', left: 0, width: '100%', backgroundColor: '#1c232b', border: '1px solid #37474f', borderRadius: 6, marginTop: 4, zIndex: 10 },
    dropdownItem: { padding: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, color: '#e0f7fa' },
    tagMenu: { position: 'absolute', top: '100%', left: 0, width: '100%', backgroundColor: '#1c232b', border: '1px solid #37474f', borderRadius: 6, marginTop: 4, zIndex: 10, padding: 10, display: 'flex', flexWrap: 'wrap', gap: 10 },
    tagPill: { backgroundColor: '#37474f', color: '#e0f7fa', padding: '4px 8px', borderRadius: 14, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, cursor: 'default' },
    tagItem: { padding: '6px 14px', borderRadius: 9999, fontSize: 14, backgroundColor: '#263238', color: '#e0f7fa', cursor: 'pointer', transition: '0.2s', border: '1px solid transparent' },
    tagItemSelected: { padding: '6px 14px', borderRadius: 9999, fontSize: 14, backgroundColor: '#00e5ff', color: '#000', cursor: 'pointer', transition: '0.2s', border: '1px solid #00e5ff' },

}