import React, { useState, useEffect } from 'react';

const styles = {
  form: {
    position: 'relative',
    margin: '8px 0 16px',
    padding: '8px 0 12px',
    borderBottom: '2px dashed var(--accent)',
  },
  input: {
    width: '100%', padding: '6px 0', border: 'none', borderBottom: '1px solid var(--border-paper)',
    background: 'transparent', color: 'var(--text-primary)', fontSize: 18,
    fontFamily: '"Caveat", cursive', fontWeight: 600, outline: 'none',
    boxSizing: 'border-box', marginBottom: 4,
  },
  textarea: {
    width: '100%', padding: '4px 0', border: 'none', borderBottom: '1px solid var(--border-paper)',
    background: 'transparent', color: 'var(--text-primary)', fontSize: 16,
    fontFamily: '"Caveat", cursive', outline: 'none', resize: 'vertical',
    minHeight: 32, boxSizing: 'border-box', lineHeight: '32px',
  },
  row: { display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap', alignItems: 'center' },
  select: {
    padding: '4px 8px', border: '1px solid var(--border-paper)', borderRadius: 4,
    background: 'transparent', color: 'var(--text-primary)', fontSize: 14,
    fontFamily: '"Caveat", cursive', cursor: 'pointer', outline: 'none',
  },
  dateInput: {
    padding: '4px 8px', border: '1px solid var(--border-paper)', borderRadius: 4,
    background: 'transparent', color: 'var(--text-primary)', fontSize: 14,
    fontFamily: '"Caveat", cursive', outline: 'none',
  },
  btn: { padding: '6px 20px', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 16, fontFamily: '"Caveat", cursive', fontWeight: 600 },
  primaryBtn: { background: 'var(--accent)', color: '#fff' },
  cancelBtn: { background: '#d5c8b5', color: '#3b2f2a' },
  error: { color: '#d35d5d', fontSize: 14, fontFamily: '"Caveat", cursive', marginTop: 4 },
};

export default function TaskForm({ onSubmit, editing, onCancelEdit }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editing) {
      setTitle(editing.title);
      setDescription(editing.description || '');
      setPriority(editing.priority || 'medium');
      setDueDate(editing.dueDate ? editing.dueDate.slice(0, 10) : '');
    } else {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setDueDate('');
    }
  }, [editing]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    setError('');
    onSubmit({ title: title.trim(), description: description.trim(), priority, dueDate: dueDate || null });
    if (!editing) {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setDueDate('');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <input style={styles.input} placeholder="What needs to be done?" value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea style={styles.textarea} placeholder="Notes..." value={description} onChange={(e) => setDescription(e.target.value)} rows={1} />
      <div style={styles.row}>
        <select style={styles.select} value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>
        <input style={styles.dateInput} type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        <button type="submit" style={{ ...styles.btn, ...styles.primaryBtn }}>{editing ? 'Update' : 'Add'}</button>
        {editing && <button type="button" style={{ ...styles.btn, ...styles.cancelBtn }} onClick={onCancelEdit}>Cancel</button>}
      </div>
      {error && <div style={styles.error}>{error}</div>}
    </form>
  );
}
