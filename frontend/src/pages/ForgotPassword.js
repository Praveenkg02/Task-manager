import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { forgotPassword as sendOtpApi, resetPassword } from '../api/axios';

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
  msg: { color: '#4a7a5a', fontFamily: '"Caveat", cursive', fontSize: 17, marginBottom: 12, textAlign: 'center' },
  error: { color: '#d35d5d', fontFamily: '"Caveat", cursive', fontSize: 17, marginBottom: 12, textAlign: 'center' },
  label: { fontFamily: '"Caveat", cursive', fontSize: 18, color: 'var(--text-secondary)', marginBottom: 2, display: 'block' },
};

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [step, setStep] = useState('email');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setMessage('');
      await sendOtpApi(email);
      setMessage('OTP sent! Check your email (or Render logs).');
      setStep('otp');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    try {
      setError('');
      setMessage('');
      await resetPassword(email, otp, password);
      setMessage('Password reset successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed');
    }
  };

  return (
    <div style={styles.wrapper}>
      <form style={styles.card} onSubmit={step === 'email' ? handleSendOtp : handleReset}>
        <div style={styles.ruledBg} />
        <div style={styles.content}>
          <h2 style={styles.title}>&#x1F511; Forgot Password</h2>
          {error && <div style={styles.error}>{error}</div>}
          {message && <div style={styles.msg}>{message}</div>}
          {step === 'email' ? (
            <>
              <label style={styles.label}>Email</label>
              <input style={styles.input} placeholder="Your email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <button style={styles.btn} type="submit">Send OTP</button>
              <div style={styles.linkWrap}>
                Remember your password? <Link to="/login" style={styles.link}>Sign in</Link>
              </div>
            </>
          ) : (
            <>
              <label style={styles.label}>OTP</label>
              <input style={styles.input} placeholder="6-digit code" type="text" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} required maxLength={6} />
              <label style={styles.label}>New Password</label>
              <input style={styles.input} placeholder="At least 6 characters" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
              <label style={styles.label}>Confirm Password</label>
              <input style={styles.input} placeholder="Repeat password" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required minLength={6} />
              <button style={styles.btn} type="submit">Reset Password</button>
              <div style={styles.linkWrap}>
                <Link to="/login" style={styles.link}>Back to Sign In</Link>
              </div>
            </>
          )}
        </div>
      </form>
    </div>
  );
}
