import React from 'react';
import { useFullProblem } from '../contexts/FullProblemContext';

const styles = {
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '0.75rem',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    color: '#ffffff',
  },
  difficultyTag: {
    padding: '6px 12px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  easy: {
    backgroundColor: '#276749',
    color: '#c6f6d5',
  },
  medium: {
    backgroundColor: '#744210',
    color: '#f6e05e',
  },
  hard: {
    backgroundColor: '#742a2a',
    color: '#feb2b2',
  },
  section: {
    marginBottom: '1.5rem',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '8px',
    color: '#e2e8f0',
  },
  preBlock: {
    backgroundColor: '#2d2d2d',
    padding: '14px',
    borderRadius: '8px',
    whiteSpace: 'pre-wrap',
    fontFamily: 'Consolas, monospace',
    border: '1px solid #444',
    lineHeight: '1.6',
    color: '#f8f8f2',
  },
  exampleBlock: {
    marginBottom: '1rem',
  },
  constraintItem: {
    paddingLeft: '1.2rem',
    position: 'relative',
    marginBottom: '6px',
  },
};

const getTagStyle = (difficulty) => {
  if (difficulty === 'Easy') return { ...styles.difficultyTag, ...styles.easy };
  if (difficulty === 'Medium') return { ...styles.difficultyTag, ...styles.medium };
  if (difficulty === 'Hard') return { ...styles.difficultyTag, ...styles.hard };
  return styles.difficultyTag;
};

const QuestionDescription = () => {
  const { problem } = useFullProblem();
  if (!problem) return <p style={{ color: '#aaa' }}>Loading...</p>;

  return (
    <div style={{ backgroundColor: '#1a1a1a', padding: '24px', borderRadius: '4px', color: '#eaeaea' }}>
      {/* Title + Difficulty */}
      <h2 style={styles.title}>
        {problem.title}
        <span style={getTagStyle(problem.difficulty)}>{problem.difficulty}</span>
      </h2>

      {/* Description */}
      <div style={styles.section}>
        <h4 style={styles.sectionTitle}>Description</h4>
        <div style={styles.preBlock}>{problem.description}</div>
      </div>

      {/* Examples */}
      <div style={styles.section}>
        <h4 style={styles.sectionTitle}>Examples</h4>
        {problem?.examples?.map((ex, index) => (
          <div key={index} style={styles.exampleBlock}>
            <div style={styles.preBlock}>
              <strong>Example {index + 1}</strong>
              <br />
              <strong>Input:</strong> {ex.input}
              <br />
              <strong>Output:</strong> {ex.output}
              <br />
              <strong>Explanation:</strong> {ex.explanation}
            </div>
          </div>
        ))}
      </div>

      {/* Constraints */}
      <div style={styles.section}>
        <h4 style={styles.sectionTitle}>Constraints</h4>
        <div style={styles.preBlock}>
          {problem.constraints?.length > 0 ? (
            problem.constraints.map((c, i) => (
              <div key={i} style={styles.constraintItem}>{c}</div>
            ))
          ) : (
            <div>No constraints provided.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionDescription;
