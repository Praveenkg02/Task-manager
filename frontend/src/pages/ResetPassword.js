import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { resetPassword } from '../api/axios';

const styles = {
  wrapper: { minHeight: 'calc(100vh - 56px)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-page)' },
  card: { background: 'var(--bg-paper)', padding: '36px 44px', borderRadius: '4px 12px 12px 4px', width: '100%', maxWidth: 400, boxShadow: '3px 3px 12px var(--shadow)', borderLeft: '4px solid var(--accent)', position: 'relative' },
  ruledBg: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'repeating-linear-gradient(to bottom, transparent, transparent 31px, #dcd3c4 31px, #dcd3c4 32px)', backgroundSize: '100% 32px', pointerEvents: 'none', opacity: 0.4, borderRadius: '0 12px 12px 0' },
  content: { position: 'relative', zIndex: 1 },
  title: { fontFamily: '"Caveat", cursive', textAlign: 'center', margin: '0 0 20px', color: 'var(--text-primary)', fontSize: 32, fontWeight: 700, borderBottom: '2px solid var(--accent)', paddingBottom: 8 },
  inputWrap: { position: 'relative', marginBottom: 16 },
  input: { width: '100%', padding: '8px 0', border: 'none', borderBottom: '1px solid var(--border-paper)', background: 'transparent', color: 'var(--text-primary)', fontSize: 16, fontFamily: '"IBM Plex Serif", serif', outline: 'none', boxSizing: 'border-box', paddingRight: 40 },
  togglePw: { position: 'absolute', right: 0, top: 4, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 13, fontFamily: '"IBM Plex Serif", serif', padding: '4px 0' },
  btn: { width: '100%', padding: 10, border: 'none', borderRadius: 4, background: 'var(--accent)', color: '#fff', fontSize: 20, fontFamily: '"Caveat", cursive', fontWeight: 700, cursor: 'pointer', marginBottom: 16 },
  link: { color: 'var(--accent)', textDecoration: 'none', fontFamily: '"Caveat", cursive', fontSize: 18, fontWeight: 600 },
  error: { color: '#d35d5d', fontFamily: '"Caveat", cursive', fontSize: 17, marginBottom: 12, textAlign: 'center' },
  msg: { color: '#4a7a5a', fontFamily: '"Caveat", cursive', fontSize: 17, marginBottom: 12, textAlign: 'center' },
  label: { fontFamily: '"Caveat", cursive', fontSize: 18, color: 'var(--text-secondary)', marginBottom: 2, display: 'block' },
  spinner: { display: 'inline-block', width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderRadius: '50%', borderTopColor: '#fff', animation: 'spin 0.6s linear infinite', verticalAlign: 'middle', marginRight: 8 },
  strengthBar: (level) => ({
    height: 3, borderRadius: 2, marginTop: -10, marginBottom: 14,
    background: ['#d35d5d', '#d4a040', '#4a7a5a', '#2e7d32'][level] || '#d35d5d',
    width: ['25%', '50%', '75%', '100%'][level],
    transition: 'all 0.3s',
  }),
};

const pwStrength = (pw) => {
  let s = 0;
  if (pw.length >= 6) s++;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[^a-zA-Z0-9]/.test(pw)) s++;
  return Math.min(s, 3);
};
const pwLabels = ['', 'Weak', 'Fair', 'Strong', 'Very Strong'];

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const strength = pwStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const { data } = await resetPassword(token, password);
      setMessage('Password reset successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      const data = err.response?.data;
      setError(data?.message || data?.errors?.[0]?.msg || 'Reset failed. Token may be invalid or expired.');
    } finally {
      setLoading(false);
    }
  };

  if (message) {
    return (
      <div style={styles.wrapper}>
        <div style={styles.card}>
          <div style={styles.ruledBg} />
          <div style={styles.content}>
            <h2 style={styles.title}>{'\u2705'} Password Reset</h2>
            <div style={styles.msg}>{message}</div>
            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <Link to="/login" style={styles.link}>Sign in</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>
      <form style={styles.card} onSubmit={handleSubmit}>
        <div style={styles.ruledBg} />
        <div style={styles.content}>
          <h2 style={styles.title}>{'\uD83D\uDD11'} Reset Password</h2>
          {error && <div style={styles.error}>{error}</div>}
          <label style={styles.label}>New Password</label>
          <div style={styles.inputWrap}>
            <input style={styles.input} placeholder="At least 6 characters" type={showPw ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
            <button type="button" style={styles.togglePw} onClick={() => setShowPw((p) => !p)}>{showPw ? 'Hide' : 'Show'}</button>
          </div>
          {password && <div style={{ fontSize: 13, fontFamily: '"IBM Plex Serif", serif', color: '#b0a090', marginTop: -10, marginBottom: 2 }}>Strength: {pwLabels[strength]}</div>}
          {password && <div style={styles.strengthBar(strength)} />}
          <label style={styles.label}>Confirm Password</label>
          <input style={styles.input} placeholder="Repeat password" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required minLength={6} />
          <button style={styles.btn} type="submit" disabled={loading}>
            {loading && <span style={styles.spinner} />}{loading ? 'Resetting...' : 'Reset Password'}
          </button>
          <div style={{ textAlign: 'center' }}>
            <Link to="/login" style={styles.link}>Back to Sign In</Link>
          </div>
        </div>
      </form>
    </div>
  );
}
