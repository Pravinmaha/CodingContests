import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getFullQuestionById, updateQuestion } from '../services/questionService';
import BasicDetails from '../components/question/BasicDetails';
import TestCases from '../components/question/TestCases';
import CodeEditorPanel from '../components/question/CodeEditorPanel';

const languages = ['c', 'cpp', 'java', 'python', 'js'];
const difficulties = [
  { value: 'Easy', color: 'limegreen' },
  { value: 'Medium', color: 'orange' },
  { value: 'Hard', color: 'red' },
];

export default function EditProblemPage() {
  const { questionId } = useParams();

  const [activeSection, setActiveSection] = useState('basic');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('Easy');
  const [selectedTags, setSelectedTags] = useState([]);
  const [constraints, setConstraints] = useState('');
  const [examples, setExamples] = useState([]);
  const [testCases, setTestCases] = useState([]);

  const [activeCodeTab, setActiveCodeTab] = useState('runner');
  const [activeLang, setActiveLang] = useState('java');
  const [currentCode, setCurrentCode] = useState('');
  const [codeMap, setCodeMap] = useState({});

  const [showDropdown, setShowDropdown] = useState(false);
  const [showTagDropdown, setShowTagDropdown] = useState(false);


  useEffect(() => {
    getFullQuestionById(questionId)
      .then((data) => {
        setTitle(data.title);
        setDescription(data.description);
        setDifficulty(data.difficulty);
        setSelectedTags(data.tags);
        setConstraints(data.constraints);
        setExamples(data.examples);
        setTestCases(data.testCases);

        const map = {};
        languages.forEach(lang => {
          const langVersion = data.versions.find(v => v.language === lang);
          map[lang] = {
            runner: langVersion?.runnerCode || '',
            reference: langVersion?.referenceSolution || '',
            default: langVersion?.starterCode || '',
            submit: langVersion?.submitCode || '',
          };
        });
        setCodeMap(map);
        setCurrentCode(map[activeLang][activeCodeTab]);
      })
      .catch(console.error);
  }, [questionId]);

  const saveCurrentCode = () => {
    setCodeMap(prev => ({
      ...prev,
      [activeLang]: {
        ...prev[activeLang],
        [activeCodeTab]: currentCode,
      },
    }));
  };

  const handleLangChange = (lang) => {
    saveCurrentCode();
    setActiveLang(lang);
    setCurrentCode(codeMap[lang][activeCodeTab] || '');
  };

  const handleTabChange = (tab) => {
    saveCurrentCode();
    setActiveCodeTab(tab);
    setCurrentCode(codeMap[activeLang][tab] || '');
  };

  const handleUpdate = () => {
    // Use callback pattern to ensure latest codeMap
    setCodeMap(prev => {
      const updatedCodeMap = {
        ...prev,
        [activeLang]: {
          ...prev[activeLang],
          [activeCodeTab]: currentCode,
        }
      };

      const versions = languages.map(lang => ({
        language: lang,
        referenceSolution: updatedCodeMap[lang]?.reference || '',
        starterCode: updatedCodeMap[lang]?.default || '',
        runnerCode: updatedCodeMap[lang]?.runner || '',
        submitCode: updatedCodeMap[lang]?.submit || '',
      }));

      const updatedProblem = {
        title,
        description,
        difficulty,
        tags: selectedTags,
        constraints,
        examples,
        testCases,
        versions,
      };

      // console.log(updatedProblem);

      // Uncomment to actually update:
      updateQuestion(questionId, updatedProblem)
        .then(() => alert('Problem updated successfully!'))
        .catch(console.error);

      return updatedCodeMap;
    });
  };


  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>✏️ Edit DSA Problem</h2>

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
          examples={examples}
          setExamples={setExamples}
          testCases={testCases}
          setTestCases={setTestCases}
          updateExamples={(i, f, v) => {
            const arr = [...examples]; arr[i][f] = v; setExamples(arr);
          }}
          removeExample={(i) => setExamples(ex => ex.filter((_, idx) => idx !== i))}
          updateTestCases={(i, f, v) => {
            const arr = [...testCases]; arr[i][f] = v; setTestCases(arr);
          }}
          removeTestCase={(i) => setTestCases(tc => tc.filter((_, idx) => idx !== i))}
        />
      )}

      {activeSection === 'codes' && (
        <CodeEditorPanel
          handleTabChange={handleTabChange}
          languages={languages}
          handleLangChange={handleLangChange}
          activeCodeTab={activeCodeTab}
          activeLang={activeLang}
          currentCode={currentCode}
          setCurrentCode={setCurrentCode}
          handleSubmit={handleUpdate}
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
