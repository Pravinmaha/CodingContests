import React from 'react';
import Editor from '@monaco-editor/react';

const styles = {
  right: {
    flex: 1,
    padding: '1rem',
    backgroundColor: '#1e1e1e',
    color: '#fff',
    borderRadius: '8px',
  },
  editorHeader: {
    marginBottom: '1rem',
  },
  select: {
    padding: '8px',
    fontSize: '14px',
    borderRadius: '6px',
    outline: 'none',
    backgroundColor: '#1e1e1e',
    color:"#fff",
    border: '1px solid #ccc',
  },
  editorContainer: {
    border: '1px solid #444',
    borderRadius: '6px',
    overflow: 'hidden',
    height: '75vh'
  },
  buttonGroup: {
    marginTop: '1rem',
    display: 'flex',
    gap: '10px',
  },
  runButton: {
    padding: '8px 16px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  submitButton: {
    padding: '8px 16px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  output: {
    marginTop: '1rem',
    backgroundColor: '#2e2e2e',
    padding: '12px',
    borderRadius: '6px',
    minHeight: '100px',
    whiteSpace: 'pre-wrap',
    fontFamily: 'monospace',
  },
};

export default function CodeEditorPanel({
  language,
  code,
  output,
  problem,
  setCode,
  handleLanguageChange,
  handleRun,
  handleSubmit,
  getMonacoLang,
}) {
  return (
    <div style={styles.right}>
      {/* Language Select */}
      <div style={styles.editorHeader}>
        <select
          value={language}
          onChange={(e) => handleLanguageChange(e.target.value)}
          style={styles.select}
        >
          {problem.versions.map((v, idx) => (
            <option key={idx} value={v.language}>
              {v.language}
            </option>
          ))}
        </select>
      </div>

      {/* Code Editor */}
      <div style={styles.editorContainer}>
        <Editor
          height="100%"
          theme="vs-dark"
          language={getMonacoLang(language)}
          value={code}
          onChange={(value) => setCode(value || '')}
          options={{
            fontSize: 14,
            fontFamily: 'monospace',
            minimap: { enabled: false },
          }}
        />
      </div>

      {/* Buttons */}
      <div style={styles.buttonGroup}>
        <button onClick={handleRun} style={styles.runButton}>
          Run
        </button>
        <button onClick={handleSubmit} style={styles.submitButton}>
          Submit
        </button>
      </div>

      {/* Output */}
      {/* <div style={styles.output}>
        <pre>{output}</pre>
      </div> */}
    </div>
  );
}
