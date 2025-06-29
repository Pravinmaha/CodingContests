import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { getSubmissionById } from '../services/submissionService';

const SubmissionDetails = () => {
  const navigate = useNavigate();
  const { questionId, contestId, submissionId } = useParams();

  const [loading, setLoading] = useState(false);

  const [submission, setSubmission] = useState(null);

  useEffect(() => {
    if (!submissionId) return;
    setLoading(true);
    getSubmissionById(submissionId)
      .then((data) => {
        setSubmission(data);
      })
      .catch((err) => {
        console.log(err)
      })
    setLoading(false)
  }, [submissionId]);

  const formatDate = (iso) => new Date(iso).toLocaleString();

  if (loading) return <p>Loading submission...</p>;
  if (!submission) return <p>Submission not found.</p>;

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button onClick={() => {
          if(contestId) navigate(`/contests/${contestId}/questions/${questionId}/submissions`);
          else navigate(`/admin/problems/${questionId}/submissions`)
        }} style={styles.backButton}>
          ⬅ Back
        </button>
        <h2 style={styles.heading}>Submission Details</h2>
      </div>

      {/* Verdict + Meta Info */}
      <div style={styles.card}>
        <div style={styles.meta}>
          <span style={submission.verdict === 'Accepted' ? styles.badgeAccepted : styles.badgeWrong}>
            {submission.verdict}
          </span>
          <span style={styles.timestamp}>{formatDate(submission.createdAt)}</span>
        </div>
        <div style={styles.metaDetails}>
          <span><strong>Language:</strong> {submission.language}</span>
          <span><strong>Execution Time:</strong> {submission.executionTime} ms</span>
          <span><strong>Memory Used:</strong> {submission.memoryUsed} KB</span>
        </div>
      </div>

      {/* Code */}
      <div style={styles.card}>
        <div style={styles.codeHeader}>
          <h3 style={styles.subheading}>Submitted Code</h3>
          <span style={styles.languageBadge}>{submission.language}</span>
        </div>
        <SyntaxHighlighter
          language={submission.language}
          style={atomDark}
          customStyle={{
            padding: '16px',
            borderRadius: '8px',
            fontSize: '15px',
          }}
        >
          {submission.code}
        </SyntaxHighlighter>
      </div>

      {/* Test Cases */}
      <div style={styles.card}>
        <h3 style={styles.subheading}>Test Case Results</h3>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>#</th>
              <th style={styles.th}>Input</th>
              <th style={styles.th}>Expected Output</th>
              <th style={styles.th}>Visibility</th>
              <th style={styles.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {submission?.testCases?.map((result, i) => (
              <tr key={i}>
                <td style={styles.td}>{i + 1}</td>

                {/* If testCase is an object, show details */}
                <td style={styles.td}>
                  <pre style={styles.inlinePre}>
                    {typeof result.testCase === 'object' ? result.testCase.input : '-'}
                  </pre>
                </td>
                <td style={styles.td}>
                  {typeof result.testCase === 'object' ? result.testCase.output : '-'}
                </td>
                <td style={styles.td}>
                  <span
                    style={
                      typeof result.testCase === 'object' && result.testCase.isPublic
                        ? styles.publicBadge
                        : styles.privateBadge
                    }
                  >
                    {typeof result.testCase === 'object' && result.testCase.isPublic
                      ? 'Public'
                      : 'Private'}
                  </span>
                </td>
                <td
                  style={{
                    ...styles.td,
                    fontWeight: 'bold',
                    color: result.status === 'Passed' ? 'lightgreen' : '#ff4d4f',
                  }}
                >
                  {result.status}
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
};

const styles = {
  // [same as you already have, no changes needed here]
  container: {
    backgroundColor: '#1e1e1e',
    color: '#e0e0e0',
    padding: '32px',
    fontFamily: 'Segoe UI, sans-serif',
    minHeight: '100vh',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '28px',
  },
  backButton: {
    fontSize: '16px',
    backgroundColor: '#333',
    border: 'none',
    color: '#fff',
    padding: '8px 14px',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  heading: {
    fontSize: '28px',
    fontWeight: '600',
    margin: 0,
  },
  card: {
    backgroundColor: '#2a2a2a',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '24px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
  },
  meta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '16px',
  },
  metaDetails: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '12px',
    color: '#bbb',
    fontSize: '14px',
  },
  timestamp: {
    color: '#aaa',
    fontSize: '14px',
  },
  badgeAccepted: {
    backgroundColor: '#28a745',
    padding: '6px 12px',
    borderRadius: '20px',
    fontWeight: 'bold',
    fontSize: '14px',
    color: 'white',
  },
  badgeWrong: {
    backgroundColor: '#d88416',
    padding: '6px 12px',
    borderRadius: '20px',
    fontWeight: 'bold',
    fontSize: '14px',
    color: 'white',
  },
  codeHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  subheading: {
    fontSize: '20px',
    color: '#fff',
    borderBottom: '1px solid #444',
    paddingBottom: '6px',
  },
  languageBadge: {
    backgroundColor: '#444',
    color: '#eee',
    padding: '4px 12px',
    borderRadius: '16px',
    fontSize: '14px',
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    borderRadius: '8px',
    overflow: 'hidden',
    fontSize: '15px',
  },
  th: {
    backgroundColor: '#3a3a3a',
    color: '#ddd',
    padding: '12px',
    textAlign: 'left',
    borderBottom: '1px solid #444',
  },
  td: {
    padding: '12px',
    borderBottom: '1px solid #444',
    verticalAlign: 'top',
  },
  inlinePre: {
    margin: 0,
    whiteSpace: 'pre-wrap',
    fontFamily: 'monospace',
  },
  publicBadge: {
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '13px',
  },
  privateBadge: {
    backgroundColor: '#6c757d',
    color: '#fff',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '13px',
  },
};

export default SubmissionDetails;
