import React, { createContext, useEffect, useState, useContext } from 'react';
import { getAllQuestions } from '../services/questionService'; // Adjust path if needed

const ProblemsContext = createContext();

export const ProblemsProvider = ({ children }) => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAllQuestions()
      .then((data) => {
        setProblems(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading questions:', err);
        setError(err);
        setLoading(false);
      });
  }, []);

  return (
    <ProblemsContext.Provider value={{ problems, loading, error }}>
      {children}
    </ProblemsContext.Provider>
  );
};

// Custom hook
export const useProblems = () => useContext(ProblemsContext);
