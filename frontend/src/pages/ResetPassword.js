import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { resetPassword } from '../api/axios';

const styles = {
  wrapper: {
    minHeight: 'calc(100vh - 56px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#e8e0d0',
  },
  card: {
    background: '#faf6ef',
    padding: '36px 44px',
    borderRadius: '4px 12px 12px 4px',
    width: '100%',
    maxWidth: 400,
    boxShadow: '3px 3px 12px rgba(0,0,0,0.1)',
    borderLeft: '4px solid #c9a96e',
    position: 'relative',
  },
  ruledBg: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundImage: 'repeating-linear-gradient(to bottom, transparent, transparent 31px, #dcd3c4 31px, #dcd3c4 32px)',
    backgroundSize: '100% 32px',
    pointerEvents: 'none',
    opacity: 0.4,
    borderRadius: '0 12px 12px 0',
  },
  content: { position: 'relative', zIndex: 1 },
  title: {
    fontFamily: '"Caveat", cursive',
    textAlign: 'center',
    margin: '0 0 20px',
    color: '#3b2f2a',
    fontSize: 32,
    fontWeight: 700,
    borderBottom: '2px solid #c9a96e',
    paddingBottom: 8,
  },
  input: {
    width: '100%',
    padding: '8px 0',
    border: 'none',
    borderBottom: '1px solid #dcd3c4',
    background: 'transparent',
    color: '#2c3e50',
    fontSize: 16,
    fontFamily: '"IBM Plex Serif", serif',
    outline: 'none',
    boxSizing: 'border-box',
    marginBottom: 16,
  },
  btn: {
    width: '100%',
    padding: 10,
    border: 'none',
    borderRadius: 4,
    background: '#c9a96e',
    color: '#fff',
    fontSize: 20,
    fontFamily: '"Caveat", cursive',
    fontWeight: 700,
    cursor: 'pointer',
    marginBottom: 16,
  },
  link: { color: '#c9a96e', textDecoration: 'none', fontFamily: '"Caveat", cursive', fontSize: 18, fontWeight: 600 },
  linkWrap: { textAlign: 'center', color: '#8a7a6a', fontFamily: '"Caveat", cursive', fontSize: 17 },
  msg: { color: '#4a7a5a', fontFamily: '"Caveat", cursive', fontSize: 17, marginBottom: 12, textAlign: 'center' },
  error: { color: '#d35d5d', fontFamily: '"Caveat", cursive', fontSize: 17, marginBottom: 12, textAlign: 'center' },
  label: {
    fontFamily: '"Caveat", cursive',
    fontSize: 18,
    color: '#6b5e4e',
    marginBottom: 2,
    display: 'block',
  },
};

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    try {
      setError('');
      setMessage('');
      await resetPassword(token, password);
      setMessage('Password reset successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed');
    }
  };

  return (
    <div style={styles.wrapper}>
      <form style={styles.card} onSubmit={handleSubmit}>
        <div style={styles.ruledBg} />
        <div style={styles.content}>
          <h2 style={styles.title}>&#x1F511; Reset Password</h2>
          {error && <div style={styles.error}>{error}</div>}
          {message && <div style={styles.msg}>{message}</div>}
          <label style={styles.label}>New Password</label>
          <input style={styles.input} placeholder="At least 6 characters" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          <label style={styles.label}>Confirm Password</label>
          <input style={styles.input} placeholder="Repeat password" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required minLength={6} />
          <button style={styles.btn} type="submit">Reset Password</button>
          <div style={styles.linkWrap}>
            <Link to="/login" style={styles.link}>Back to Sign In</Link>
          </div>
        </div>
      </form>
    </div>
  );
}
