import React, { createContext, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getFullContest } from '../services/contestService';
import { useAuth } from './AuthContext';

const FullContestContext = createContext();

export const FullContestProvider = ({ children }) => {
  const { contestId } = useParams(); // read from route
  const [contest, setContest] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refresh, setRefresh] = useState(true);
    const {isLoggedIn} = useAuth();

  

  useEffect(() => {
    if (!contestId) return;
    setLoading(true);
    getFullContest(contestId)
      .then((data) => {
        setContest(data);
        // console.log(data)
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load full contest:', err);
        setError(err);
        setLoading(false);
      });
  }, [contestId, refresh, isLoggedIn]);

  return (
    <FullContestContext.Provider value={{ contest, loading, error, setRefresh }}>
      {children}
    </FullContestContext.Provider>
  );
};

export const useFullContest = () => useContext(FullContestContext);
