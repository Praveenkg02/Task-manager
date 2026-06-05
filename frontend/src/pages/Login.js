import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const styles = {
  wrapper: {
    minHeight: 'calc(100vh - 60px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#1a1a2e',
  },
  card: {
    background: '#16213e',
    padding: '32px 40px',
    borderRadius: 12,
    width: '100%',
    maxWidth: 400,
    border: '1px solid #0f3460',
  },
  title: { textAlign: 'center', margin: '0 0 24px', color: '#fff', fontSize: 24 },
  input: {
    width: '100%',
    padding: '10px 14px',
    borderRadius: 6,
    border: '1px solid #0f3460',
    background: '#1a1a2e',
    color: '#fff',
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
    marginBottom: 14,
  },
  btn: {
    width: '100%',
    padding: 12,
    borderRadius: 6,
    border: 'none',
    background: '#e94560',
    color: '#fff',
    fontSize: 16,
    fontWeight: 600,
    cursor: 'pointer',
    marginBottom: 16,
  },
  link: { color: '#e94560', textDecoration: 'none', fontSize: 14 },
  linkWrap: { textAlign: 'center', color: '#a0a0b0', fontSize: 14 },
  error: { color: '#e94560', fontSize: 13, marginBottom: 12, textAlign: 'center' },
};

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={styles.wrapper}>
      <form style={styles.card} onSubmit={handleSubmit}>
        <h2 style={styles.title}>Login</h2>
        {error && <div style={styles.error}>{error}</div>}
        <input style={styles.input} placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input style={styles.input} placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button style={styles.btn} type="submit">Login</button>
        <div style={styles.linkWrap}>
          Don't have an account? <Link to="/register" style={styles.link}>Register</Link>
        </div>
      </form>
    </div>
  );
}
