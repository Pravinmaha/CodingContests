import React, { createContext, useEffect, useState, useContext } from 'react';
import { getMyContests } from '../services/contestService';

const ContestsContext = createContext();

export const ContestsProvider = ({ children }) => {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getMyContests()
      .then((data) => {
        setContests(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading contests:', err);
        setError(err);
        setLoading(false);
      });
  }, []);

  return (
    <ContestsContext.Provider value={{ contests, loading, error }}>
      {children}
    </ContestsContext.Provider>
  );
};

// Custom hook
export const useMyContests = () => useContext(ContestsContext);
