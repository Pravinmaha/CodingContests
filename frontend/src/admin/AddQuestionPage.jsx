import React, { useEffect, useState } from 'react';
import { addQuestion } from '../services/questionService';
import data from '../../Guidlines.json';
import BasicDetails from '../components/question/BasicDetails';
import TestCases from '../components/question/TestCases';
import CodeEditorPanel from '../components/question/CodeEditorPanel';
import Guidlines from '../components/question/Guidlines';

const languages = ['c', 'cpp', 'java', 'python', 'js'];

export default function AddProblemPage() {
  const [activeSection, setActiveSection] = useState('basic');
  const [guidlines, setGuidlines] = useState('');
  const [showGuidelines, setShowGuidelines] = useState(false);

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

  const [examples, setExamples] = useState([{ input: '', output: '', explanation: '' }]);
  const [constraints, setConstraints] = useState('');
  const [testCases, setTestCases] = useState([{ input: '', output: '' }]);

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

  useEffect(() => {
    const saved = localStorage.getItem('addProblemDraft');
    if (saved) {
      const {
        title, description, difficulty, selectedTags,
        constraints, examples, testCases,
        codeMap, activeLang, activeCodeTab, currentCode,
      } = JSON.parse(saved);

      setTitle(title);
      setDescription(description);
      setDifficulty(difficulty);
      setSelectedTags(selectedTags);
      setConstraints(constraints);
      setExamples(examples);
      setTestCases(testCases);
      setCodeMap(codeMap);
      setActiveLang(activeLang);
      setActiveCodeTab(activeCodeTab);
      setCurrentCode(currentCode);
    }
  }, []);


  useEffect(() => {
    const interval = setInterval(() => {
      const problemData = {
        title,
        description,
        difficulty,
        selectedTags,
        constraints,
        examples,
        testCases,
        codeMap,
        activeLang,
        activeCodeTab,
        currentCode,
      };

      localStorage.setItem('addProblemDraft', JSON.stringify(problemData));
      console.log('Problem draft saved to localStorage');
    }, 2000); // Save every 5 seconds

    return () => clearInterval(interval); // Clean up on unmount
  }, [title, description, difficulty, selectedTags, constraints, examples, testCases, codeMap, activeLang, activeCodeTab, currentCode]);


  const updateExamples = (i, field, val) => {
    const arr = [...examples]; arr[i][field] = val; setExamples(arr);
  };
  const removeExample = i => setExamples(ex => ex.filter((_, idx) => idx !== i));
  const updateTestCases = (i, field, val) => {
    const arr = [...testCases]; arr[i][field] = val; setTestCases(arr);
  };
  const removeTestCase = i => setTestCases(tc => tc.filter((_, idx) => idx !== i));

  const saveCurrentCode = () => {
    setCodeMap(prev => ({
      ...prev,
      [activeLang]: { ...prev[activeLang], [activeCodeTab]: currentCode },
    }));
  };
  const handleLangChange = lang => { saveCurrentCode(); setActiveLang(lang); setCurrentCode(codeMap[lang][activeCodeTab] || ''); };
  const handleTabChange = tab => { saveCurrentCode(); setActiveCodeTab(tab); setCurrentCode(codeMap[activeLang][tab] || ''); };

  const openGuidlines = (field) => {
    if (field === 'examples') setGuidlines(data.examplesGuidlines);
    else if (field === 'testCases') setGuidlines(data.testCasesGuidlines);
    else if (field === 'runner') setGuidlines(data.runnerCodeGuidelines + "\n\n" + data.exampleRunnerCode)
    else if (field === 'submit') setGuidlines(data.submitCodeGuidelines + "\n\n" + data.exampleSubmitCode)
    else if (field === 'reference') setGuidlines(data.referenceCodeGuidelines + "\n\n" + data.exampleReferenceCode)
    else setGuidlines(data.defaultCodeGuidlines+"\n\n"+data.exampleDefaultCode);

    setShowGuidelines(true);
  };

  const toggleGuidelines = () => setShowGuidelines(false);

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
    catch (err) { console.error(err); }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>🚀 Add New DSA Problem</h2>

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

      {activeSection === 'basic' && (
        <BasicDetails
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          difficulty={difficulty}
          setDifficulty={setDifficulty}
          showDropdown={showDropdown}
          setShowDropdown={setShowDropdown}
          difficulties={difficulties}
          showTagDropdown={showTagDropdown}
          setShowTagDropdown={setShowTagDropdown}
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
          constraints={constraints}
          setConstraints={setConstraints}
        />
      )}

      {activeSection === 'testcases' && (
        <TestCases
          openGuidlines={openGuidlines}
          examples={examples}
          setExamples={setExamples}
          updateExamples={updateExamples}
          removeExample={removeExample}
          testCases={testCases}
          updateTestCases={updateTestCases}
          removeTestCase={removeTestCase}
          setTestCases={setTestCases}
        />
      )}

      {activeSection === 'codes' && (
        <CodeEditorPanel
          openGuidlines={openGuidlines}
          handleTabChange={handleTabChange}
          languages={languages}
          handleLangChange={handleLangChange}
          activeCodeTab={activeCodeTab}
          activeLang={activeLang}
          currentCode={currentCode}
          setCurrentCode={setCurrentCode}
          handleSubmit={handleSubmit}
        />
      )}

      {showGuidelines && (
        <Guidlines
          toggleGuidelines={toggleGuidelines}
          guidlines={guidlines}
        />
      )}
    </div>
  );
}

const styles = {
  container: { position: 'relative', padding: 30, width: '100%', margin: '0 auto', fontFamily: 'sans-serif', backgroundColor: '#10141a', color: '#e0f7fa', borderRadius: 8 },
  heading: { fontSize: 28, marginBottom: 20, fontWeight: 'bold', color: '#4dd0e1' },
  sectionTabs: { display: 'flex', gap: 16, marginBottom: 24 },
  sectionTab: { padding: '8px 16px', background: '#263238', border: 'none', borderRadius: 6, cursor: 'pointer', color: '#90caf9' },
  activeSectionTab: { padding: '8px 16px', background: '#00e5ff', border: 'none', borderRadius: 6, cursor: 'pointer', color: '#000', fontWeight: 'bold' },

};
