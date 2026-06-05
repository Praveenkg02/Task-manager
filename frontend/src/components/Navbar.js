import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const styles = {
  header: {
    background: '#3b2f2a',
    color: '#f5f0e8',
    padding: '0 32px',
    height: 56,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '3px solid #c9a96e',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    fontFamily: '"Caveat", cursive',
  },
  logo: {
    fontSize: 28,
    fontWeight: 700,
    color: '#c9a96e',
    textDecoration: 'none',
    letterSpacing: 1,
  },
  right: { display: 'flex', alignItems: 'center', gap: 16 },
  name: { fontSize: 18, color: '#d4c5a9' },
  btn: {
    background: 'transparent',
    border: '1px solid #c9a96e',
    color: '#c9a96e',
    padding: '6px 20px',
    borderRadius: 4,
    cursor: 'pointer',
    fontSize: 16,
    fontFamily: '"Caveat", cursive',
    fontWeight: 600,
  },
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <header style={styles.header}>
      <Link to="/" style={styles.logo}>&#x270D; Task Journal</Link>
      {user && (
        <div style={styles.right}>
          <span style={styles.name}>{user.name}</span>
          <button style={styles.btn} onClick={handleLogout}>Logout</button>
        </div>
      )}
    </header>
  );
}
