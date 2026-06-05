import React, { useState, useEffect } from 'react';

const styles = {
  form: {
    background: '#16213e',
    padding: 20,
    borderRadius: 10,
    marginBottom: 24,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  input: {
    padding: '10px 14px',
    borderRadius: 6,
    border: '1px solid #0f3460',
    background: '#1a1a2e',
    color: '#fff',
    fontSize: 14,
    outline: 'none',
  },
  textarea: {
    padding: '10px 14px',
    borderRadius: 6,
    border: '1px solid #0f3460',
    background: '#1a1a2e',
    color: '#fff',
    fontSize: 14,
    outline: 'none',
    resize: 'vertical',
    minHeight: 60,
    fontFamily: 'inherit',
  },
  row: { display: 'flex', gap: 12 },
  btn: {
    padding: '10px 24px',
    borderRadius: 6,
    border: 'none',
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: 600,
  },
  primaryBtn: { background: '#0f3460', color: '#fff' },
  cancelBtn: { background: '#533483', color: '#fff' },
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
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        style={styles.textarea}
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      {error && <div style={{ color: '#e94560', fontSize: 13 }}>{error}</div>}
      <div style={styles.row}>
        <button type="submit" style={{ ...styles.btn, ...styles.primaryBtn }}>
          {editing ? 'Update Task' : 'Add Task'}
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
