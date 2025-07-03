import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getFullQuestionById } from '../services/questionService';

export default function ViewProblemPage() {
  const { questionId } = useParams();
  const [problem, setProblem] = useState(null);

  useEffect(() => {
    getFullQuestionById(questionId)
      .then((data) => {
        console.log(data);
        setProblem(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [questionId]);

  if (!problem) {
    return <p style={styles.loading}>Loading problem...</p>;
  }

  const {
    title,
    description,
    difficulty,
    tags,
    constraints,
    examples,
    testCases,
    versions,
  } = problem;

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>{title}</h1>

      <section style={styles.section}>
        <h2 style={styles.subheading}>📝 Description</h2>
        <p style={styles.text}>{description}</p>
      </section>

      <section style={styles.section}>
        <h2 style={styles.subheading}>📊 Difficulty</h2>
        <span style={{ ...styles.difficulty, color: getColor(difficulty) }}>{difficulty}</span>
      </section>

      <section style={styles.section}>
        <h2 style={styles.subheading}>🏷️ Tags</h2>
        <div style={styles.tagList}>
          {tags?.map((tag, idx) => (
            <span key={idx} style={styles.tag}>{tag}</span>
          ))}
        </div>
      </section>

      <section style={styles.section}>
        <h2 style={styles.subheading}>📌 Constraints</h2>
        <pre style={styles.pre}>{constraints}</pre>
      </section>

      <section style={styles.section}>
        <h2 style={styles.subheading}>💡 Examples</h2>
        {examples?.map((ex, i) => (
          <div key={i} style={styles.card}>
            <p><strong>Input:</strong></p>
            <pre style={styles.pre}>{ex.input}</pre>
            <p><strong>Output:</strong></p>
            <pre style={styles.pre}>{ex.output}</pre>
            <p><strong>Explanation:</strong> {ex.explanation}</p>
          </div>
        ))}
      </section>

      <section style={styles.section}>
        <h2 style={styles.subheading}>🧪 Test Cases</h2>
        {testCases?.map((tc, i) => (
          <div key={i} style={styles.card}>
            <p><strong>Input:</strong></p>
            <pre style={styles.pre}>{tc.input}</pre>
            <p><strong>Output:</strong></p>
            <pre style={styles.pre}>{tc.output}</pre>
          </div>
        ))}
      </section>

      <section style={styles.section}>
        <h2 style={styles.subheading}>💻 Code Versions</h2>
        {versions?.map((v, i) => (
          <div key={i} style={styles.card}>
            <h3 style={styles.langTitle}>{v.language.toUpperCase()}</h3>
            <p><strong>Reference Solution:</strong></p>
            <pre style={styles.code}>{v.referenceSolution}</pre>
            <p><strong>Starter Code:</strong></p>
            <pre style={styles.code}>{v.starterCode}</pre>
            <p><strong>Runner Code:</strong></p>
            <pre style={styles.code}>{v.runnerCode}</pre>
            <p><strong>Submit Code:</strong></p>
            <pre style={styles.code}>{v.submitCode}</pre>
          </div>
        ))}
      </section>
    </div>
  );
}

const getColor = (difficulty) => {
  switch (difficulty) {
    case 'Easy': return '#81C784';
    case 'Medium': return '#FFB74D';
    case 'Hard': return '#E57373';
    default: return '#90CAF9';
  }
};

const styles = {
  container: {
    padding: '40px 30px',
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    fontFamily: "'Segoe UI', sans-serif",
    background: 'linear-gradient(145deg, #0f121a, #0c0f17)',
    color: '#e0f7fa',
    borderRadius: '14px',
    boxShadow: '0 4px 25px rgba(0,0,0,0.6)',
    animation: 'fadeIn 0.5s ease-in-out',
  },
  heading: {
    fontSize: '36px',
    fontWeight: 'bold',
    marginBottom: '32px',
    color: '#00e5ff',
    textAlign: 'center',
    textShadow: '1px 1px 4px rgba(0,0,0,0.7)',
  },
  subheading: {
    fontSize: '22px',
    marginBottom: '14px',
    color: '#80deea',
    borderBottom: '2px solid #00e5ff',
    paddingBottom: '5px',
    letterSpacing: '0.5px',
  },
  section: {
    marginBottom: '36px',
  },
  difficulty: {
    fontSize: '18px',
    fontWeight: 'bold',
    padding: '6px 12px',
    borderRadius: '6px',
    backgroundColor: '#1c1c1f',
    display: 'inline-block',
    boxShadow: 'inset 0 0 6px rgba(0,0,0,0.4)',
  },
  tagList: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
    marginTop: '8px',
  },
  tag: {
    backgroundColor: '#2a2d34',
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '500',
    color: '#b2ebf2',
    boxShadow: '0 2px 4px rgba(0,0,0,0.4)',
    transition: 'transform 0.2s ease',
  },
  card: {
    backgroundColor: '#181b22',
    padding: '20px',
    marginBottom: '18px',
    borderRadius: '10px',
    border: '1px solid #2f3238',
    boxShadow: '0 3px 6px rgba(0,0,0,0.5)',
    transition: 'transform 0.2s ease-in-out',
  },
  langTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#4dd0e1',
    marginBottom: '14px',
  },
  text: {
    fontSize: '16px',
    lineHeight: '1.7',
    color: '#cfd8dc',
  },
  pre: {
    backgroundColor: '#1e1e1e',
    padding: '12px',
    borderRadius: '8px',
    color: '#dce775',
    overflowX: 'auto',
    marginBottom: '12px',
    fontSize: '15px',
    fontFamily: 'Consolas, Monaco, monospace',
    border: '1px solid #2b2f36',
  },
  code: {
    backgroundColor: '#111317',
    color: '#b2ebf2',
    padding: '12px',
    borderRadius: '8px',
    overflowX: 'auto',
    fontSize: '14px',
    fontFamily: 'Consolas, Monaco, monospace',
    marginBottom: '20px',
    border: '1px solid #2b2f36',
  },
  loading: {
    textAlign: 'center',
    padding: '50px',
    color: '#bbb',
    fontSize: '20px',
  },
};

