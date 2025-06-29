import React, { useEffect, useState } from 'react';

const styles = {
  mainTabContainer: {
    display: 'flex',
    gap: '16px',
    margin: '1rem 0',
    borderBottom: '2px solid #444',
  },
  mainTab: (active) => ({
    padding: '10px 16px',
    cursor: 'pointer',
    borderBottom: active ? '3px solid #00b4ff' : 'none',
    fontWeight: active ? '700' : '500',
    color: active ? '#00b4ff' : '#bbb',
  }),
  tabContainer: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  tabWrapper: {
    position: 'relative',
  },
  tab: (active) => ({
    padding: '10px 20px',
    cursor: 'pointer',
    backgroundColor: active ? '#333' : 'transparent',
    color: active ? '#fff' : '#ccc',
    borderRadius: '8px',
    border: 'none',
  }),
  closeBtn: {
    position: 'absolute',
    top: '-6px',
    right: '-6px',
    width: '20px',
    height: '20px',
    backgroundColor: 'rgb(70, 70, 70)',
    border: 'none',
    borderRadius: '50%',
    color: '#fff',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '12px',
    lineHeight: '20px',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#2c2c2c',
    padding: '12px 16px',
    borderRadius: '8px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '1rem',
    border: '1px solid #444',
  },
  label: {
    fontWeight: '600',
    marginBottom: '6px',
    fontSize: '14px',
    color: '#ddd',
  },
  input: {
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid #555',
    fontSize: '14px',
    outline: 'none',
    backgroundColor: '#1e1e1e',
    color: '#f0f0f0',
    width: '100%',
  },
  addBtn: {
    padding: '6px 15px',
    marginLeft: '20px',
    borderRadius: '999px',
    border: '1px solid #fff',
    backgroundColor: '#1e1e1e',
    color: '#fff',
    fontSize: '24px',
    cursor: 'pointer',
  },
};

export default function TestCaseEditor({ runError, examples, setAllInputs, results, activeMainView, setActiveMainView, isExpanded, setIsExpanded }) {
  const [testCases, setTestCases] = useState([{ input: '', values: {}, expectedOutput: '', actualOutput: '' }]);
  const [activeTab, setActiveTab] = useState(0);
  // const [activeMainView, setActiveMainView] = useState('testcases');
  // const [isExpanded, setIsExpanded] = useState(false);



  const parseInput = (input) => {
    const obj = {};
    input.split('\n').forEach((pair) => {
      const [key, value] = pair.split('=').map((s) => s.trim());
      if (key) obj[key] = value ?? '';
    });
    return obj;
  };

  const updateAllInputsString = (cases) => {
    const inputLines = [];

    for (const testCase of cases) {
      const values = testCase.values || {};
      let temp = "";
      for (const [key, value] of Object.entries(values)) {
        temp += value + '\n';
      }
      inputLines.push(temp);
    }
    setAllInputs(inputLines);
  };


  useEffect(() => {
    if (examples?.length > 0) {
      const formatted = examples.map((ex) => ({
        input: ex.input,
        values: parseInput(ex.input),
        expectedOutput: ex.output || '',
        actualOutput: '',
      }));
      setTestCases(formatted);
      updateAllInputsString(formatted);
    }
  }, [examples]);

  const handleFieldChange = (index, field, value) => {
    const updated = [...testCases];
    updated[index].values[field] = value;
    updated[index].input = Object.entries(updated[index].values)
      .map(([k, v]) => `${k}=${v}`)
      .join(', ');
    setTestCases(updated);
    updateAllInputsString(updated);
  };

  const handleOutputChange = (index, type, value) => {
    const updated = [...testCases];
    updated[index][type] = value;
    setTestCases(updated);
  };

  const addTestCase = () => {
    if (testCases.length >= 8) return;
    const base = testCases[activeTab] || { input: '', values: {} };
    const newInput = Object.entries(base.values)
      .map(([k, v]) => `${k}=${v}`)
      .join(', ');
    setTestCases([
      ...testCases,
      { input: newInput, values: { ...base.values }, expectedOutput: '', actualOutput: '' },
    ]);
    updateAllInputsString([
      ...testCases,
      { input: newInput, values: { ...base.values }, expectedOutput: '', actualOutput: '' },
    ]);
    setActiveTab(testCases.length);
  };

  const removeTestCase = (index) => {
    if (testCases.length <= 1) return;
    const updated = [...testCases];
    updated.splice(index, 1);
    setTestCases(updated);
    updateAllInputsString(updated);
    if (activeTab >= updated.length) {
      setActiveTab(updated.length - 1);
    }
  };

  return (
    <div
      style={{
        height: isExpanded ? '1500px' : '80px',
        backgroundColor: '#1a1a1a',
        padding: '1rem',
        borderRadius: '10px',
        color: '#eee',
        position: 'relative',
        transition: 'height 0.3s ease'
      }}
    >
      {/* Main Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={styles.mainTabContainer}>
          <div
            style={styles.mainTab(activeMainView === 'testcases')}
            onClick={() => setActiveMainView('testcases')}
          >
            🧪 Testcases
          </div>
          <div
            style={styles.mainTab(activeMainView === 'results')}
            onClick={() => setActiveMainView('results')}
          >
            📊 Test Results
          </div>
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            marginLeft: 'auto',
            padding: '6px 12px',
            fontSize: '14px',
            backgroundColor: '#444',
            color: '#fff',
            border: '1px solid #666',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          {isExpanded ? '🔽 Minimize' : '🔼 Expand'}
        </button>
      </div>


      {/* Testcase Tabs & Content */}
      {testCases[activeTab] && activeMainView === 'testcases' && (
        <>
          <div style={styles.tabContainer}>
            {testCases.map((_, i) => (
              <div key={i} style={styles.tabWrapper}>
                <div
                  style={styles.tab(i === activeTab)}
                  onClick={() => setActiveTab(i)}
                >
                  Case {i + 1}
                </div>
                {testCases.length > 1 && (
                  <button style={styles.closeBtn} onClick={() => removeTestCase(i)}>
                    ×
                  </button>
                )}
              </div>
            ))}
            {testCases.length < 8 && (
              <button onClick={addTestCase} style={styles.addBtn}>
                +
              </button>
            )}
          </div>

          <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column' }}>
            {Object.entries(testCases[activeTab].values).map(([key, val], i) => (
              <div key={i} style={styles.card}>
                <label style={styles.label}>{key}</label>
                <input
                  style={styles.input}
                  value={val}
                  onChange={(e) => handleFieldChange(activeTab, key, e.target.value)}
                />
              </div>
            ))}
          </div>
        </>
      )}

      {activeMainView === 'results' && runError?.trim().length > 0 ?
        <div style={{ backgroundColor: "rgba(253, 118, 118, 0.12)", padding: "30px", borderRadius: "12px" }}>
          <pre style={{ color: "rgb(219, 60, 60)" }}>{runError}</pre>
        </div>

        :
        <>
          {/* Results View */}
          {results.length > 0 && activeMainView === 'results' && (
            <>
              <div style={styles.tabContainer}>
                {results.map((_, i) => (
                  <div key={i} style={styles.tabWrapper}>
                    <div
                      style={styles.tab(i === activeTab)}
                      onClick={() => setActiveTab(i)}
                    >
                      Case {i + 1}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeMainView === 'results' && (<div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column' }}>
            {results.length > 0 ? <>{Object.entries(testCases[activeTab]?.values).map(([key, val]) => (
              <div key={key} style={styles.card}>
                <label style={styles.label}>{key}</label>
                <input style={styles.input} value={val} readOnly />
              </div>
            ))}
              {results[activeTab]?.stdout && <div style={styles.card}>
                <label style={styles.label}>Stdout</label>
                <div style={styles.input}>{results[activeTab]?.stdout}</div>
              </div>}

              <div style={styles.card}>
                <label style={styles.label}>Your Output</label>
                <div style={styles.input}>{results[activeTab]?.actualOutput}</div>
              </div>
              <div style={styles.card}>
                <label style={styles.label}>Expected Output</label>
                <div style={styles.input}>
                  {results[activeTab]?.expectedOutput}
                </div>
              </div>
            </>
              :
              <div style={styles.label}>You must run your code first</div>

            }
          </div>)}
        </>}
    </div>
  );
}
