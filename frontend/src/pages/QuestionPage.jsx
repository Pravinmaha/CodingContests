import { useState, useEffect, useRef } from 'react';
import { useFullProblem } from '../contexts/FullProblemContext';
import TestCaseEditor from '../components/TestCaseEditor';
import CodeEditorPanel from '../components/CodeEditorPanel';
import { runCode, submitCode } from '../services/codeRunnerService';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';

export default function QuestionPage() {
  const { problem, loading, error } = useFullProblem();
  const [language, setLanguage] = useState('c');
  const [code, setCode] = useState('');
  const [runResults, setRunResults] = useState([]);
  const [leftWidth, setLeftWidth] = useState(50);
  const [allInputs, setAllInputs] = useState([]);
  const [runError, setRunError] = useState('');
  const [activeMainView, setActiveMainView] = useState('testcases');
  const [isExpanded, setIsExpanded] = useState(false);

  const { contestId } = useParams();


  const location = useLocation();

  const activeTab = location.pathname.includes('/submissions') ? 'submissions' : 'description';


  const navigate = useNavigate();

  const resizerRef = useRef(null);

  function parseJavaOutput(rawOutput) {
    if (typeof rawOutput !== 'string') return [];

    // const lines = rawOutput.replace("[", "").replace("]", "").split(",");

    const trimmed = rawOutput.slice(1, -1);

    const entries = trimmed
      .split(/,\s*actualOutput=/)
      .map((entry, index) => {
        const text = index === 0 ? entry : 'actualOutput=' + entry;

        return text
          .trim()
          .replace(/\n/g, '\n')
          .replace(/\s+$/, ''); // remove trailing spaces
      });

    const results = [];
    for (let i = 0; i < entries.length; i++) {
      const outputs = entries[i].replace(/\r\n/g, '\n').trim().split('\n');
      const actual = outputs[0]?.split('=')[1]?.trim();
      const expected = outputs[1]?.split('=')[1]?.trim();
      const stdout = outputs[2]?.split('=')[1]?.trim();

      if (actual !== undefined && expected !== undefined) {
        results.push({
          actualOutput: actual,
          expectedOutput: expected,
          stdout
        });
      }
    }
    setRunResults(results)

    return results;
  }


  useEffect(() => {
    if (problem && problem?.versions) {
      let l = localStorage.getItem("language") || 'c';
      const langObj = problem?.versions.find(v => v.language === l);
      setLanguage(l);
      setCode(langObj ? langObj.starterCode : '');
      setRunError('');
    }
  }, [problem]);

  const handleRun = () => {
    runCode(problem?._id, language, code, allInputs)
      .then((data) => {
        console.log(data)
        parseJavaOutput(data.output)
        setRunError('')
        setActiveMainView("results")
        setIsExpanded(true);

      })
      .catch((err) => {
        console.log(err)
        setRunError(err.response.data.message)
        setActiveMainView("results")
        setIsExpanded(true);
      })
  }


  const handleSubmit = () => {
    submitCode(problem?._id, language, code, contestId)
      .then(async (data) => {
        // alert("Question submitted");
        if (contestId)
          navigate(`/contests/${contestId}/questions/${problem._id}/submissions/${data._id}`);
        else
          navigate(`/admin/problems/${problem._id}/submissions/${data._id}`)
      })
      .catch((err) => {
        setRunError(err?.response?.data?.message?.error);
        if (err?.response?.data?.message?.error) {
          setActiveMainView("results");
          setIsExpanded(true);
        }
      })
  }


  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    localStorage.setItem("language", lang)
    const langObj = problem?.versions.find(v => v.language === lang);
    setCode(langObj ? langObj.starterCode : '');
  };

  const getMonacoLang = (lang) => {
    switch (lang.toLowerCase()) {
      case 'java': return 'java';
      case 'python': return 'python';
      case 'js': return 'javascript';
      case 'cpp': return 'cpp';
      case 'c': return 'c';
      default: return 'plaintext';
    }
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (resizerRef.current?.isResizing) {
        document.body.style.userSelect = 'none';
        const percentage = (e.clientX / window.innerWidth) * 100;
        setLeftWidth(Math.min(70, Math.max(30, percentage)));
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.style.userSelect = '';
    };
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading problem</p>;

  return (
    <div style={{ ...styles.page, height: `${contestId ? '90vh' : '100vh'}`, }}>
      {/* LEFT PANEL */}
      <div style={{ ...styles.left, width: `${leftWidth}%` }}>
        <div style={styles.tabButtons}>
          <button
            onClick={() => {
              if (contestId) navigate(`/contests/${contestId}/questions/${problem._id}/`);
              else navigate(`/admin/problems/${problem._id}`)
            }}
            style={activeTab === 'description' ? styles.activeTabButton : styles.tabButton}
          >
            📄 Description
          </button>
          <button
            onClick={() => {
              if (!location.pathname.endsWith('/submissions')) {
                navigate(`submissions`);
              }
            }}
            style={activeTab === 'submissions' ? styles.activeTabButton : styles.tabButton}
          >
            📜 Submissions
          </button>

        </div>

        <div style={styles.leftContent}>
          <Outlet />
        </div>

        <TestCaseEditor
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
          activeMainView={activeMainView}
          setActiveMainView={setActiveMainView}
          runError={runError}
          results={runResults}
          examples={problem?.examples}
          setAllInputs={setAllInputs}
        />

      </div>

      {/* VERTICAL RESIZER */}
      <div
        ref={resizerRef}
        onMouseDown={() => (resizerRef.current.isResizing = true)}
        style={styles.verticalResizer}
      />

      {/* RIGHT PANEL */}
      <div style={{ ...styles.right, width: `${100 - leftWidth}%` }}>
        <CodeEditorPanel
          language={language}
          code={code}
          versions={problem?.versions}
          setCode={setCode}
          handleLanguageChange={handleLanguageChange}
          handleRun={handleRun}
          handleSubmit={handleSubmit}
          getMonacoLang={getMonacoLang}
        />
      </div>
    </div>
  );
}

const styles = {
  page: {
    display: 'flex',
    height: '90vh',
    overflow: 'hidden',
    backgroundColor: '#1e1e1e',
    color: '#ddd',
    fontFamily: 'Segoe UI, sans-serif',
  },
  left: {
    display: 'flex',
    flexDirection: 'column',
    background: '#121212',
    borderRight: '1px solid #333',
    overflow: 'hidden',
  },
  leftContent: {
    flexGrow: 1,
    overflowY: 'auto',
    padding: '10px 16px',
  },
  right: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#1e1e1e',
    color: '#eee',
    overflow: 'hidden',
  },
  tabButtons: {
    display: 'flex',
    gap: '10px',
    padding: '10px 16px',
    backgroundColor: '#1a1a1a',
    borderBottom: '1px solid #333',
  },
  tabButton: {
    backgroundColor: '#2a2a2a',
    padding: '8px 14px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 500,
    color: '#ccc',
  },
  activeTabButton: {
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '8px 14px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 600,
  },
  verticalResizer: {
    width: '5px',
    cursor: 'col-resize',
    backgroundColor: '#444',
    zIndex: 10,
  },
};
