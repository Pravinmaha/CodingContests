import React, { useState, useRef, useEffect } from 'react';

const CustomSelect = ({ options, selected, onSelect, placeholder = 'Select...', style = {} }) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} style={{ ...styles.wrapper, ...style }}>
      <div
        style={styles.control}
        onClick={() => setOpen(!open)}
      >
        {selected || <span style={{ color: '#888' }}>{placeholder}</span>}
        <span style={styles.arrow}>▼</span>
      </div>

      {open && (
        <div style={styles.menu}>
          {options.map((opt, idx) => (
            <div
              key={idx}
              style={{
                ...styles.option,
                backgroundColor: selected === opt ? '#333' : 'transparent',
              }}
              onClick={() => {
                onSelect(opt);
                setOpen(false);
              }}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  wrapper: {
    position: 'relative',
    width: '200px',
    fontFamily: 'Arial',
    fontSize: '14px',
  },
  control: {
    backgroundColor: '#1e1e1e',
    color: '#f1f1f1',
    padding: '10px',
    border: '1px solid #444',
    borderRadius: '6px',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  arrow: {
    marginLeft: '10px',
    fontSize: '10px',
  },
  menu: {
    position: 'absolute',
    top: '110%',
    left: 0,
    right: 0,
    backgroundColor: '#2c2c2c',
    border: '1px solid #444',
    borderRadius: '6px',
    zIndex: 1000,
    boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
  },
  option: {
    padding: '10px',
    cursor: 'pointer',
    color: '#f1f1f1',
  },
};

export default CustomSelect;
