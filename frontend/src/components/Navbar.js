import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const styles = {
  header: {
    background: '#1a1a2e',
    color: '#fff',
    padding: '0 24px',
    height: 60,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: { fontSize: 20, fontWeight: 700, color: '#fff', textDecoration: 'none' },
  right: { display: 'flex', alignItems: 'center', gap: 16 },
  name: { fontSize: 14, opacity: 0.8 },
  btn: {
    background: 'transparent',
    border: '1px solid #e94560',
    color: '#e94560',
    padding: '6px 16px',
    borderRadius: 6,
    cursor: 'pointer',
    fontSize: 14,
  },
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <header style={styles.header}>
      <Link to="/" style={styles.logo}>TaskManager</Link>
      {user && (
        <div style={styles.right}>
          <span style={styles.name}>{user.name}</span>
          <button style={styles.btn} onClick={handleLogout}>Logout</button>
        </div>
      )}
    </header>
  );
}
