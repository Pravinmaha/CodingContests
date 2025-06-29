import React, { createContext, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getSubmissions } from '../services/submissionService';

const SubmissionsContext = createContext();

export const SubmissionsProvider = ({ children }) => {
  const { questionId, submissionId } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    if (!questionId) return;
    setLoading(true);
    getSubmissions(questionId)
      .then((data) => {
        setSubmissions(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log('Failed to load submissions:', err);
        setError(err);
        setLoading(false);
      });

  }, [questionId, submissionId]);

  return (
    <SubmissionsContext.Provider value={{ submissions, loading, error }}>
      {children}
    </SubmissionsContext.Provider>
  );
};

export const useSubmissions = () => useContext(SubmissionsContext);
