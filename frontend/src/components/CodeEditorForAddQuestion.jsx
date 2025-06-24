import React from 'react';
import Editor from '@monaco-editor/react';

export default function CodeEditor({ activeLang, currentCode, setCurrentCode }) {
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

  return (
    <div style={{
      marginTop: '10px',
      border: '1px solid #263238',
      borderRadius: '6px',
      overflow: 'hidden',
    }}>
      <Editor
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
    </div>
  );
}
