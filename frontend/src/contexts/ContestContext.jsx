import React, { createContext, useEffect, useState, useContext } from 'react';
import { getMyContests } from '../services/contestService';
import { useAuth } from './AuthContext';

const ContestsContext = createContext();

export const ContestsProvider = ({ children }) => {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
    const {isLoggedIn} = useAuth();

  

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
  }, [isLoggedIn]);

  return (
    <ContestsContext.Provider value={{ contests, loading, error }}>
      {children}
    </ContestsContext.Provider>
  );
};

// Custom hook
export const useMyContests = () => useContext(ContestsContext);
