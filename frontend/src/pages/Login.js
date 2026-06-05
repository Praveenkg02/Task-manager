import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const styles = {
  wrapper: { minHeight: 'calc(100vh - 56px)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-page)' },
  card: { background: 'var(--bg-paper)', padding: '36px 44px', borderRadius: '4px 12px 12px 4px', width: '100%', maxWidth: 400, boxShadow: '3px 3px 12px var(--shadow)', borderLeft: '4px solid var(--accent)', position: 'relative' },
  ruledBg: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'repeating-linear-gradient(to bottom, transparent, transparent 31px, #dcd3c4 31px, #dcd3c4 32px)', backgroundSize: '100% 32px', pointerEvents: 'none', opacity: 0.4, borderRadius: '0 12px 12px 0' },
  content: { position: 'relative', zIndex: 1 },
  title: { fontFamily: '"Caveat", cursive', textAlign: 'center', margin: '0 0 20px', color: 'var(--text-primary)', fontSize: 32, fontWeight: 700, borderBottom: '2px solid var(--accent)', paddingBottom: 8 },
  input: { width: '100%', padding: '8px 0', border: 'none', borderBottom: '1px solid var(--border-paper)', background: 'transparent', color: 'var(--text-primary)', fontSize: 16, fontFamily: '"IBM Plex Serif", serif', outline: 'none', boxSizing: 'border-box', marginBottom: 16 },
  btn: { width: '100%', padding: 10, border: 'none', borderRadius: 4, background: 'var(--accent)', color: '#fff', fontSize: 20, fontFamily: '"Caveat", cursive', fontWeight: 700, cursor: 'pointer', marginBottom: 16 },
  link: { color: 'var(--accent)', textDecoration: 'none', fontFamily: '"Caveat", cursive', fontSize: 18, fontWeight: 600 },
  linkWrap: { textAlign: 'center', color: 'var(--text-muted)', fontFamily: '"Caveat", cursive', fontSize: 17 },
  error: { color: '#d35d5d', fontFamily: '"Caveat", cursive', fontSize: 17, marginBottom: 12, textAlign: 'center' },
  label: { fontFamily: '"Caveat", cursive', fontSize: 18, color: 'var(--text-secondary)', marginBottom: 2, display: 'block' },
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
        <div style={styles.ruledBg} />
        <div style={styles.content}>
          <h2 style={styles.title}>&#x1F4DD; Sign In</h2>
          {error && <div style={styles.error}>{error}</div>}
          <label style={styles.label}>Email</label>
          <input style={styles.input} placeholder="Your email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <label style={styles.label}>Password</label>
          <input style={styles.input} placeholder="Your password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button style={styles.btn} type="submit">Login</button>
          <div style={{ ...styles.linkWrap, marginBottom: 8 }}>
            <Link to="/forgot-password" style={{ ...styles.link, fontSize: 16 }}>Forgot password?</Link>
          </div>
          <div style={styles.linkWrap}>
            New here? <Link to="/register" style={styles.link}>Create an account</Link>
          </div>
        </div>
      </form>
    </div>
  );
}
