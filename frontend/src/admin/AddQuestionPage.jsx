import React, { useState } from 'react';
import { addQuestion } from '../services/questionService';
import CodeEditor from '../components/CodeEditorForAddQuestion';

const languages = ['c', 'cpp', 'java', 'python', 'js'];
const tagOptions = ['Array', 'HashMap', 'String', 'DP', 'Graph', 'Math', 'Greedy'];

export default function AddProblemPage() {
  // Section tabs: basic, testcases, codes
  const [activeSection, setActiveSection] = useState('basic');

  // Basic details
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const difficulties = [
    { value: 'Easy', color: 'limegreen' },
    { value: 'Medium', color: 'orange' },
    { value: 'Hard', color: 'red' },
  ];
  const [difficulty, setDifficulty] = useState('Easy');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [showTagDropdown, setShowTagDropdown] = useState(false);

  // Examples & Test Cases
  const [examples, setExamples] = useState([{ input: '', output: '', explanation: '' }]);
  const [constraints, setConstraints] = useState('');
  const [testCases, setTestCases] = useState([{ input: '', output: '' }]);

  // Code sections
  const [activeCodeTab, setActiveCodeTab] = useState('runner');
  const [activeLang, setActiveLang] = useState('java');
  const [currentCode, setCurrentCode] = useState('');
  const [codeMap, setCodeMap] = useState({
    python: { runner: '', reference: '', default: '', submit: '' },
    cpp: { runner: '', reference: '', default: '', submit: '' },
    java: { runner: '', reference: '', default: '', submit: '' },
    js: { runner: '', reference: '', default: '', submit: '' },
    c: { runner: '', reference: '', default: '', submit: '' },
  });

  // Handlers for examples & testcases
  const updateExamples = (i, field, val) => {
    const arr = [...examples]; arr[i][field] = val; setExamples(arr);
  };
  const removeExample = i => setExamples(ex => ex.filter((_, idx) => idx !== i));
  const updateTestCases = (i, field, val) => {
    const arr = [...testCases]; arr[i][field] = val; setTestCases(arr);
  };
  const removeTestCase = i => setTestCases(tc => tc.filter((_, idx) => idx !== i));

  // Save code before switching
  const saveCurrentCode = () => {
    setCodeMap(prev => ({
      ...prev,
      [activeLang]: { ...prev[activeLang], [activeCodeTab]: currentCode },
    }));
  };
  const handleLangChange = lang => { saveCurrentCode(); setActiveLang(lang); setCurrentCode(codeMap[lang][activeCodeTab] || ''); };
  const handleTabChange = tab => { saveCurrentCode(); setActiveCodeTab(tab); setCurrentCode(codeMap[activeLang][tab] || ''); };

  // Tags
  const handleTagChange = e => {
    const selected = Array.from(e.target.selectedOptions).map(opt => opt.value);
    setSelectedTags(selected);
  };

  // Submission
  const handleSubmit = () => {
    saveCurrentCode();
    const versions = languages.map(lang => ({
      language: lang,
      referenceSolution: codeMap[lang].reference,
      starterCode: codeMap[lang].default,
      runnerCode: codeMap[lang].runner,
      submitCode: codeMap[lang].submit,
    }));
    const problem = { title, description, examples, constraints, difficulty, tags: selectedTags, testCases, versions };
    try { addQuestion(problem); alert('Question added'); }
    catch(err){ console.error(err); }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>🚀 Add New DSA Problem</h2>
      {/* Section Tabs */}
      <div style={styles.sectionTabs}>
        {['basic', 'testcases', 'codes'].map(sec => (
          <button
            key={sec}
            onClick={() => setActiveSection(sec)}
            style={activeSection === sec ? styles.activeSectionTab : styles.sectionTab}
          >
            {sec === 'basic' ? 'Basic Details' : sec === 'testcases' ? 'Test Cases' : 'Codes'}
          </button>
        ))}
      </div>

      {/* BASIC DETAILS SECTION */}
      {activeSection === 'basic' && (
        <>
          <h3 style={styles.sectionHeading}>Title</h3>
          <input placeholder="Problem Title" style={styles.input} value={title} onChange={e => setTitle(e.target.value)} />

          <h3 style={styles.sectionHeading}>Description</h3>
          <textarea placeholder="Problem Description" style={styles.textarea} value={description} onChange={e => setDescription(e.target.value)} />

          <div style={{ marginTop: 16 }}>
            <h3 style={styles.sectionHeading}>⚙️ Difficulty</h3>
            <div style={{ position: 'relative' }}>
              <div onClick={() => setShowDropdown(d => !d)} style={{...styles.input, cursor:'pointer', display:'flex', justifyContent:'space-between'}}>
                <span style={{display:'flex', alignItems:'center', gap:8}}>
                  <span style={{width:10,height:10,borderRadius:'50%',backgroundColor: difficulties.find(d=>d.value===difficulty).color}} />
                  {difficulty}
                </span>
                <span>▼</span>
              </div>
              {showDropdown && (
                <div style={styles.dropdownMenu}>
                  {difficulties.map(d => (
                    <div key={d.value} onClick={()=>{setDifficulty(d.value); setShowDropdown(false)}} style={styles.dropdownItem}>
                      <span style={{width:10,height:10,borderRadius:'50%',backgroundColor:d.color}} /> {d.value}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <h3 style={styles.sectionHeading}>⚙️ Tags</h3>
          <div style={{ position: 'relative' }}>
            <div onClick={()=>setShowTagDropdown(t=>!t)} style={{...styles.input, cursor:'pointer', minHeight:50, display:'flex', flexWrap:'wrap', gap:8}}>
              {selectedTags.length ? selectedTags.map(t=> <div key={t} style={styles.tagPill}>{t} <span onClick={e=>{e.stopPropagation(); setSelectedTags(ts=>ts.filter(x=>x!==t));}}>×</span></div>)
                : <span style={{color:'#777'}}>Select Tags...</span> }
            </div>
            {showTagDropdown && (
              <div style={styles.tagMenu}>
                {tagOptions.map(tag=>{
                  const sel = selectedTags.includes(tag);
                  return <div key={tag} onClick={()=>setSelectedTags(ts=> sel? ts.filter(x=>x!==tag): [...ts, tag])} style={sel? styles.tagItemSelected:styles.tagItem}>{tag}</div>;
                })}
              </div>
            )}
          </div>

          <h3 style={styles.sectionHeading}>📍 Constraints</h3>
          <textarea placeholder="Constraints (e.g., 1 ≤ n ≤ 10^5)" style={styles.textarea} value={constraints} onChange={e=>setConstraints(e.target.value)} />

        </>
      )}

      {/* TEST CASES SECTION */}
      {activeSection === 'testcases' && (
        <>
          <h3 style={styles.sectionHeading}>📌 Examples</h3>
          {examples.map((ex,i)=>(
            <div key={i} style={styles.card}>
              <input placeholder="Input" style={styles.input} value={ex.input} onChange={e=> updateExamples(i,'input',e.target.value)} />
              <textarea placeholder="Output" style={styles.input} value={ex.output} onChange={e=> updateExamples(i,'output',e.target.value)} />
              <input placeholder="Explanation" style={styles.input} value={ex.explanation} onChange={e=> updateExamples(i,'explanation',e.target.value)} />
              {examples.length>1 && <button style={styles.removeBtn} onClick={()=>removeExample(i)}>Remove</button>}
            </div>
          ))}
          <button onClick={()=>setExamples(ex=>[...ex,{input:'',output:'',explanation:''}])} style={styles.addBtn}>➕ Add Example</button>

          <h3 style={styles.sectionHeading}>🧪 Test Cases</h3>
          {testCases.map((tc,i)=>(
            <div key={i} style={styles.card}>
              <div style={{display:'flex', gap:10}}>
                <textarea placeholder="Input" style={{...styles.textarea, flex:1}} value={tc.input} onChange={e=> updateTestCases(i,'input',e.target.value)} />
                <textarea placeholder="Output" style={{...styles.textarea, flex:1}} value={tc.output} onChange={e=> updateTestCases(i,'output',e.target.value)} />
              </div>
              {testCases.length>1 && <button style={styles.removeBtn} onClick={()=>removeTestCase(i)}>Remove</button>}
            </div>
          ))}
          <button onClick={()=>setTestCases(tc=>[...tc,{input:'',output:''}])} style={styles.addBtn}>➕ Add Test Case</button>
        </>
      )}

      {/* CODES SECTION */}
      {activeSection === 'codes' && (
        <>
          <h3 style={styles.sectionHeading}>🧠 Code</h3>
          <div style={styles.tabLineBar}>
            {['runner','reference','default','submit'].map(tab=> (
              <button key={tab} onClick={()=>handleTabChange(tab)} style={activeCodeTab===tab?styles.activeTab:styles.tab}>
                {tab.charAt(0).toUpperCase()+tab.slice(1)} Code
              </button>
            ))}
          </div>
          <div style={styles.tabBar}>
            {languages.map(lang=> (
              <button key={lang} onClick={()=>handleLangChange(lang)} style={activeLang===lang? {...styles.tabPill,...styles.activeTabPill} : styles.tabPill}>
                {lang}
              </button>
            ))}
          </div>
          <CodeEditor activeLang={activeLang} currentCode={currentCode} setCurrentCode={setCurrentCode} />
          <button onClick={handleSubmit} style={styles.submitBtn}>✅ Submit Problem</button>
        </>
      )}
    </div>
  );
}

// Styles remain mostly unchanged, extended for new elements
const styles = {
  container: { padding: 30, width:'100%', margin:'0 auto', fontFamily:'sans-serif', backgroundColor:'#10141a', color:'#e0f7fa', borderRadius:8 },
  heading: { fontSize:28, marginBottom:20, fontWeight:'bold', color:'#4dd0e1' },
  sectionTabs: { display:'flex', gap:16, marginBottom:24 },
  sectionTab: { padding:'8px 16px', background:'#263238', border:'none', borderRadius:6, cursor:'pointer', color:'#90caf9' },
  activeSectionTab: { padding:'8px 16px', background:'#00e5ff', border:'none', borderRadius:6, cursor:'pointer', color:'#000', fontWeight:'bold' },
  sectionHeading: { fontSize:20, marginTop:24, color:'#80deea', fontWeight:600 },
  input: { width:'100%', margin:'8px 0', padding:10, borderRadius:6, border:'1px solid #37474f', backgroundColor:'#1c232b', color:'#e0f7fa', fontSize:15 },
  textarea: { width:'100%', margin:'8px 0', padding:10, borderRadius:6, fontSize:15, border:'1px solid #37474f', backgroundColor:'#1c232b', color:'#e0f7fa' },
  dropdownMenu: { position:'absolute', top:'100%', left:0, width:'100%', backgroundColor:'#1c232b', border:'1px solid #37474f', borderRadius:6, marginTop:4, zIndex:10 },
  dropdownItem: { padding:10, cursor:'pointer', display:'flex', alignItems:'center', gap:8, color:'#e0f7fa' },
  tagMenu: { position:'absolute', top:'100%', left:0, width:'100%', backgroundColor:'#1c232b', border:'1px solid #37474f', borderRadius:6, marginTop:4, zIndex:10, padding:10, display:'flex', flexWrap:'wrap', gap:10 },
  tagPill: { backgroundColor:'#37474f', color:'#e0f7fa', padding:'4px 8px', borderRadius:14, fontSize:13, display:'flex', alignItems:'center', gap:6, cursor:'default' },
  tagItem: { padding:'6px 14px', borderRadius:9999, fontSize:14, backgroundColor:'#263238', color:'#e0f7fa', cursor:'pointer', transition:'0.2s', border:'1px solid transparent' },
  tagItemSelected: { padding:'6px 14px', borderRadius:9999, fontSize:14, backgroundColor:'#00e5ff', color:'#000', cursor:'pointer', transition:'0.2s', border:'1px solid #00e5ff' },
  card: { border:'1px solid #263238', padding:16, borderRadius:8, backgroundColor:'#151c25', marginTop:10 },
  addBtn: { background:'#4fc3f7', color:'#000', padding:'8px 14px', border:'none', borderRadius:6, marginTop:10, cursor:'pointer' },
  removeBtn: { background:'#ef5350', color:'#fff', padding:'6px 10px', border:'none', borderRadius:6, marginTop:10, cursor:'pointer' },
  tabBar: { display:'flex', borderBottom:'2px solid #263238', marginBottom:12, gap:16 },
  tabLineBar: { display:'flex', gap:16, borderBottom:'2px solid #263238', marginBottom:12 },
  tab: { padding:'10px 0', background:'transparent', border:'none', borderBottom:'2px solid transparent', color:'#90caf9', fontSize:15, fontWeight:500, cursor:'pointer', transition:'border-bottom 0.2s, color 0.2s' },
  activeTab: { padding:'10px 0', background:'transparent', border:'none', borderBottom:'2px solid #00e5ff', color:'#00e5ff', fontSize:15, fontWeight:600, cursor:'pointer' },
  tabPill: { padding:'6px 16px', borderRadius:9999, border:'1px solid #37474f', backgroundColor:'#1a1f27', color:'#e0f7fa', fontSize:14, cursor:'pointer', transition:'all 0.2s ease-in-out' },
  activeTabPill: { backgroundColor:'#00e5ff', color:'#000', border:'1px solid #00e5ff', fontWeight:'bold' },
  submitBtn: { background:'#26c6da', color:'#000', padding:'12px 20px', border:'none', borderRadius:6, fontSize:16, marginTop:30, cursor:'pointer', fontWeight:'bold' },
};
