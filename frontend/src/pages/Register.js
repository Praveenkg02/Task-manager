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

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      await register(name, email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Registration failed');
    }
  };

  return (
    <div style={styles.wrapper}>
      <form style={styles.card} onSubmit={handleSubmit}>
        <h2 style={styles.title}>Register</h2>
        {error && <div style={styles.error}>{error}</div>}
        <input style={styles.input} placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input style={styles.input} placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input style={styles.input} placeholder="Password (min 6 chars)" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
        <button style={styles.btn} type="submit">Register</button>
        <div style={styles.linkWrap}>
          Already have an account? <Link to="/login" style={styles.link}>Login</Link>
        </div>
      </form>
    </div>
  );
}
