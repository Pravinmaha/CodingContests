import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div style={styles.container}>
      <aside style={styles.sidebar}>
        <h2 style={styles.logo}>🛠 Admin</h2>
        <nav style={styles.nav}>
          {[
            // { label: 'Dashboard', path: '/admin' },
            { label: 'Contests', path: '/admin/contests' },
            { label: 'Problems', path: '/admin/problems' },
          ].map((item, i) => (
            <NavLink
              key={item.path}
              to={item.path}
              end
              style={({ isActive }) => ({
                ...styles.link,
                ...(isActive ? styles.activeLink : {}),
              })}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main style={styles.content}>
        <Outlet />
      </main>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    fontFamily: 'Poppins, sans-serif',
    backgroundColor: '#0d1117',
    color: '#e2e8f0',
  },
  sidebar: {
    width: '260px',
    background: 'linear-gradient(180deg, #1f2937 0%, #111827 100%)',
    padding: '30px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '40px',
    borderRight: '1px solid #2d3748',
    boxShadow: '2px 0 10px rgba(0,0,0,0.3)',
  },
  logo: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#60a5fa',
    letterSpacing: '1px',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  link: {
    padding: '12px 16px',
    fontSize: '16px',
    color: '#cbd5e1',
    textDecoration: 'none',
    borderRadius: '10px',
    transition: 'all 0.2s ease-in-out',
  },
  activeLink: {
    backgroundColor: 'rgba(96, 165, 250, 0.15)',
    color: '#60a5fa',
    fontWeight: 600,
    boxShadow: 'inset 0 0 8px rgba(96, 165, 250, 0.2)',
  },
  content: {
    flex: 1,
    // padding: '24px 32px',
    overflowY: 'auto',
    backgroundColor: '#0d1117',
  },
};

export default AdminLayout;
