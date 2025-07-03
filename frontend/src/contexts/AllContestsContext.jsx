import React, { createContext, useEffect, useState, useContext } from 'react';
import { getAllContests } from '../services/contestService';
import { useAuth } from './AuthContext';

const AllContestsContext = createContext();

export const AllContestsProvider = ({ children }) => {
  const [allContests, setAllContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isLoggedIn } = useAuth();


  useEffect(() => {
    getAllContests()
      .then((data) => {
        setAllContests(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading allContests:', err);
        setError(err);
        setLoading(false);
      });
  }, [isLoggedIn]);

  return (
    <AllContestsContext.Provider value={{ allContests, loading, error }}>
      {children}
    </AllContestsContext.Provider>
  );
};

// Custom hook
export const useAllContests = () => useContext(AllContestsContext);
