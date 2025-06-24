import React, { createContext, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getFullQuestionById } from '../services/questionService';

const FullProblemContext = createContext();

export const FullProblemProvider = ({ children }) => {
  const { questionId } = useParams(); // read from route
  const [problem, setProblem] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!questionId) return;
    setLoading(true);
    getFullQuestionById(questionId)
      .then((data) => {
        setProblem(data);
        console.log(data)
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load full problem:', err);
        setError(err);
        setLoading(false);
      });
  }, [questionId]);

  return (
    <FullProblemContext.Provider value={{ problem, loading, error }}>
      {children}
    </FullProblemContext.Provider>
  );
};

export const useFullProblem = () => useContext(FullProblemContext);
