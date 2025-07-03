import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const {isLoggedIn, setIsLoggedIn} = useAuth();

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    navigate('/login')
    setIsLoggedIn(false);
  };

  return (
    <div style={styles.navbar}>
      {/* Left Logo */}
      <div style={styles.logo}></div>

      {/* Right Buttons */}
      <div style={styles.buttons}>
        {!isLoggedIn ? (
          <>
            <button style={styles.button} onClick={() => navigate('/login')}>Login</button>
            <button style={styles.button} onClick={() => navigate('/register')}>Register</button>
          </>
        ) : (
          <button style={styles.button} onClick={handleLogout}>Logout</button>
        )}
      </div>
    </div>
  );
};

const styles = {
  navbar: {
    width: '100%',
    padding: '12px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'rgba(28, 28, 28, 0)',
    color: '#fff',
    fontFamily: 'sans-serif',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    // boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
    flexWrap: 'wrap',
    position: 'absolute'
  },
  logo: {
    fontSize: '22px',
    fontWeight: 'bold',
    letterSpacing: '1px',
  },
  buttons: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  button: {
    background: '#00e5ff',
    color: '#000',
    padding: '8px 16px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '14px',
    transition: '0.2s ease-in-out',
  }
};

export default Navbar;
