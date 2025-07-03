import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProblems } from '../contexts/ProblemContext';

const AdminProblemsPage = () => {
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');

  const navigate = useNavigate();

  const { problems, loading, error } = useProblems();

  if (loading) return <p style={styles.loading}>Loading problems...</p>;
  if (error) return <p style={styles.error}>Error loading problems.</p>;

  const uniqueTags = [...new Set(problems.flatMap(p => p.tags))];

  const handleEditQuestion = (problem) => {
    navigate(`/admin/problems/${problem._id}/edit`)
  }

  const filteredProblems = problems.filter(problem => {
    return (
      problem.title.toLowerCase().includes(search.toLowerCase()) &&
      (selectedTag === '' || problem.tags.includes(selectedTag)) &&
      (selectedDifficulty === '' || problem.difficulty === selectedDifficulty)
    );
  });

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>🛠️ Admin - Problems List</h1>

      <div style={styles.topBar}>
        <input
          style={styles.input}
          type="text"
          placeholder="🔍 Search by title"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          style={styles.select}
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
        >
          <option value="">All Tags</option>
          {uniqueTags.map((tag, idx) => (
            <option key={idx} value={tag}>{tag}</option>
          ))}
        </select>

        <select
          style={styles.select}
          value={selectedDifficulty}
          onChange={(e) => setSelectedDifficulty(e.target.value)}
        >
          <option value="">All Difficulty</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        <Link to={'/admin/add-question'}>
          <button style={styles.addButton}>+ Add Problem</button>
        </Link>
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>#</th>
            <th style={styles.th}>Title</th>
            <th style={styles.th}>Difficulty</th>
            <th style={styles.th}>Tags</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProblems.map((problem, index) => (
            <tr key={problem._id} style={styles.tr}>
              <td style={styles.td}>{index + 1}</td>
              <td style={{ ...styles.td, color: '#61dafb' }}>
                <Link to={`/admin/problems/${problem._id}`} style={styles.link}>
                  {problem.title}
                </Link>
              </td>
              <td style={{ ...styles.td, ...styles[problem.difficulty.toLowerCase()] }}>
                {problem.difficulty}
              </td>
              <td style={styles.td}>{problem.tags.join(', ')}</td>
              <td style={styles.td} onClick={() => handleEditQuestion(problem)}>Edit</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#1e1e2f',
    color: '#f0f0f0',
    padding: '24px',
    minHeight: '100vh',
    fontFamily: 'Segoe UI, sans-serif',
  },
  heading: {
    fontSize: '26px',
    fontWeight: 'bold',
    marginBottom: '24px',
    color: '#ffffff',
  },
  topBar: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    marginBottom: '20px',
  },
  input: {
    padding: '10px',
    width: '220px',
    backgroundColor: '#2e2e3f',
    border: '1px solid #444',
    color: '#fff',
    borderRadius: '6px',
  },
  select: {
    padding: '10px',
    backgroundColor: '#2e2e3f',
    border: '1px solid #444',
    color: '#fff',
    borderRadius: '6px',
  },
  addButton: {
    padding: '10px 16px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: '0.3s',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '12px',
  },
  th: {
    textAlign: 'left',
    padding: '12px 8px',
    backgroundColor: '#2d2d3f',
    color: '#ddd',
    borderBottom: '2px solid #444',
  },
  td: {
    padding: '10px 8px',
    borderBottom: '1px solid #333',
  },
  tr: {
    transition: '0.2s',
  },
  link: {
    color: '#61dafb',
    textDecoration: 'none',
  },
  easy: {
    color: '#28a745',
    fontWeight: 'bold',
  },
  medium: {
    color: '#ffc107',
    fontWeight: 'bold',
  },
  hard: {
    color: '#dc3545',
    fontWeight: 'bold',
  },
  loading: {
    color: '#888',
    padding: '20px',
  },
  error: {
    color: 'red',
    padding: '20px',
  },
};

export default AdminProblemsPage;
