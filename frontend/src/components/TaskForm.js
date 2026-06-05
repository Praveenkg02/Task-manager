import React, { useState, useEffect } from 'react';

const styles = {
  form: {
    position: 'relative',
    margin: '8px 0 16px',
    padding: '8px 0 12px',
    borderBottom: '2px dashed #c9a96e',
  },
  input: {
    width: '100%',
    padding: '6px 0',
    border: 'none',
    borderBottom: '1px solid #dcd3c4',
    background: 'transparent',
    color: '#2c3e50',
    fontSize: 18,
    fontFamily: '"Caveat", cursive',
    fontWeight: 600,
    outline: 'none',
    boxSizing: 'border-box',
    marginBottom: 4,
  },
  textarea: {
    width: '100%',
    padding: '4px 0',
    border: 'none',
    borderBottom: '1px solid #dcd3c4',
    background: 'transparent',
    color: '#2c3e50',
    fontSize: 16,
    fontFamily: '"Caveat", cursive',
    outline: 'none',
    resize: 'vertical',
    minHeight: 32,
    boxSizing: 'border-box',
    lineHeight: '32px',
  },
  row: { display: 'flex', gap: 8, marginTop: 8 },
  btn: {
    padding: '6px 20px',
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer',
    fontSize: 16,
    fontFamily: '"Caveat", cursive',
    fontWeight: 600,
  },
  primaryBtn: { background: '#c9a96e', color: '#fff' },
  cancelBtn: { background: '#d5c8b5', color: '#3b2f2a' },
  error: { color: '#d35d5d', fontSize: 14, fontFamily: '"Caveat", cursive', marginTop: 4 },
};

export default function TaskForm({ onSubmit, editing, onCancelEdit }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editing) {
      setTitle(editing.title);
      setDescription(editing.description || '');
    } else {
      setTitle('');
      setDescription('');
    }
  }, [editing]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    setError('');
    onSubmit({ title: title.trim(), description: description.trim() });
    if (!editing) {
      setTitle('');
      setDescription('');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <input
        style={styles.input}
        placeholder="What needs to be done?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        style={styles.textarea}
        placeholder="Notes..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={1}
      />
      {error && <div style={styles.error}>{error}</div>}
      <div style={styles.row}>
        <button type="submit" style={{ ...styles.btn, ...styles.primaryBtn }}>
          {editing ? 'Update' : 'Add'}
        </button>
        {editing && (
          <button type="button" style={{ ...styles.btn, ...styles.cancelBtn }} onClick={onCancelEdit}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
