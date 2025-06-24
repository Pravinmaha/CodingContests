// admin/EditQuestionPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import { updateQuestion } from '../services/questionService';
import CodeEditor from '../components/CodeEditorForAddQuestion';
import { useFullProblem } from '../contexts/FullProblemContext';

const languages = ['c', 'cpp', 'java', 'python', 'js'];
const tagOptions = ['Array', 'HashMap', 'String', 'DP', 'Graph', 'Math', 'Greedy'];
const difficulties = [
  { value: 'Easy', color: 'limegreen' },
  { value: 'Medium', color: 'orange' },
  { value: 'Hard', color: 'red' },
];

export default function EditQuestionPage() {
  const navigate = useNavigate();
  const { problem, loading } = useFullProblem();

  if (loading) return <>Loading...</>

  console.log(problem)

  // Basic
  const [title, setTitle] = useState(problem.title);
  const [description, setDescription] = useState(problem.description);
  const [constraints, setConstraints] = useState(problem.constraints || '');
  const [difficulty, setDifficulty] = useState(problem.difficulty);
  const [selectedTags, setSelectedTags] = useState(problem.tags || []);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showTagDropdown, setShowTagDropdown] = useState(false);

  // Examples & Testcases
  const [examples, setExamples] = useState(problem.examples || [{ input: '', output: '', explanation: '' }]);
  const [testCases, setTestCases] = useState(problem.testCases || [{ input: '', output: '' }]);

  // Code Versions
  const [activeCodeTab, setActiveCodeTab] = useState('runner');
  const [activeLang, setActiveLang] = useState('java');
  const [currentCode, setCurrentCode] = useState('');
  const [codeMap, setCodeMap] = useState(
    languages.reduce((map, lang) => {
      const version = problem.versions.find(v => v.language === lang) || {};
      map[lang] = {
        runner: version.runnerCode || '',
        reference: version.referenceSolution || '',
        default: version.starterCode || '',
        submit: version.submitCode || ''
      };
      return map;
    }, {})
  );

  useEffect(() => {
    setCurrentCode(codeMap[activeLang][activeCodeTab]);
  }, [activeLang, activeCodeTab, codeMap]);

  // Full Save (all fields)
  const handleUpdate = async () => {
    const updated = {
      ...problem,
      title,
      description,
      constraints,
      difficulty,
      tags: selectedTags,
      examples,
      testCases,
      versions: languages.map(lang => ({
        language: lang,
        runnerCode: codeMap[lang].runner,
        referenceSolution: codeMap[lang].reference,
        starterCode: codeMap[lang].default,
        submitCode: codeMap[lang].submit,
      }))
    };
    try {
      // await updateQuestion(problem.id, updated);
      alert('Question saved!');
      navigate(-1);
    } catch (e) {
      console.error(e);
      alert('Save failed');
    }
  };

  // Save only code versions
  const handleSaveCodes = async () => {
    // capture current editor
    setCodeMap(prev => ({ ...prev, [activeLang]: { ...prev[activeLang], [activeCodeTab]: currentCode } }));
    const payload = {
      versions: languages.map(lang => ({
        language: lang,
        runnerCode: codeMap[lang].runner,
        referenceSolution: codeMap[lang].reference,
        starterCode: codeMap[lang].default,
        submitCode: codeMap[lang].submit,
      }))
    };
    try {
      // await updateQuestion(problem.id, payload);
      alert('Code versions saved!');
    } catch (e) {
      console.error(e);
      alert('Save codes failed');
    }
  };

  // Handlers
  const updateExamples = (i, field, val) => { const arr = [...examples]; arr[i][field] = val; setExamples(arr); };
  const removeExample = i => setExamples(prev => prev.filter((_, idx) => idx !== i));
  const updateTestCases = (i, field, val) => { const arr = [...testCases]; arr[i][field] = val; setTestCases(arr); };
  const removeTestCase = i => setTestCases(prev => prev.filter((_, idx) => idx !== i));
  const handleLangChange = lang => { setCodeMap(prev => ({ ...prev, [activeLang]: { ...prev[activeLang], [activeCodeTab]: currentCode } })); setActiveLang(lang); };
  const handleTabChange = tab => { setCodeMap(prev => ({ ...prev, [activeLang]: { ...prev[activeLang], [activeCodeTab]: currentCode } })); setActiveCodeTab(tab); };
  const handleTagChange = e => setSelectedTags(Array.from(e.target.selectedOptions).map(o => o.value));

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>✏️ Edit Problem</h2>
      {/* ... other tabs omitted for brevity ... */}

      {/* Code Editor Tab */}
      <h3 style={styles.sectionHeading}>🧠 Code</h3>
      <div style={styles.tabLineBar}>
        {['runner', 'reference', 'default', 'submit'].map(tab => (
          <button key={tab} onClick={() => handleTabChange(tab)} style={activeCodeTab === tab ? styles.activeTab : styles.tab}>{tab}</button>
        ))}
      </div>
      <div style={styles.tabBar}>
        {languages.map(lang => (
          <button key={lang} onClick={() => handleLangChange(lang)} style={activeLang === lang ? styles.activeTabPill : styles.tabPill}>{lang}</button>
        ))}
      </div>
      <CodeEditor activeLang={activeLang} currentCode={currentCode} setCurrentCode={setCurrentCode} />
      <button style={styles.saveCodesBtn} onClick={handleSaveCodes}>💾 Save Codes</button>

      {/* Full Save */}
      <button style={styles.submitBtn} onClick={handleUpdate}>✅ Save All</button>
    </div>
  );
}

const styles = {
  // ... existing styles ...
  saveCodesBtn: {
    background: '#facc15',
    color: '#000',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '6px',
    marginTop: '12px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  submitBtn: {
    background: '#22c55e',
    color: '#000',
    padding: '12px 20px',
    border: 'none',
    borderRadius: '6px',
    marginTop: '16px',
    cursor: 'pointer',
    fontWeight: 'bold'
  }
};
