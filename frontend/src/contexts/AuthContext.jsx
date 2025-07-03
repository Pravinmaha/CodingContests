import React, { createContext, useEffect, useState, useContext } from 'react';
import { getFullContest } from '../services/contestService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        getFullContest(null)
            .then((data) => {
                setIsLoggedIn(true);
            })
            .catch((err) => {
                if (err.status === 401) {
                    setIsLoggedIn(false);
                }
                else {
                    setIsLoggedIn(true);
                }
            });
    }, []);

    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook
export const useAuth = () => useContext(AuthContext);
