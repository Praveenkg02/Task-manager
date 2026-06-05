import React from 'react';

const styles = {
  card: {
    background: '#16213e',
    borderRadius: 10,
    padding: '14px 18px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    border: '1px solid #0f3460',
  },
  content: { flex: 1, minWidth: 0 },
  title: (done) => ({
    fontSize: 16,
    fontWeight: 600,
    margin: '0 0 4px',
    textDecoration: done ? 'line-through' : 'none',
    opacity: done ? 0.6 : 1,
    color: '#fff',
  }),
  desc: { fontSize: 13, color: '#a0a0b0', margin: 0, wordBreak: 'break-word' },
  meta: { fontSize: 11, color: '#666', marginTop: 6 },
  actions: { display: 'flex', gap: 6, flexShrink: 0 },
  iconBtn: {
    background: 'transparent',
    border: '1px solid #333',
    borderRadius: 6,
    color: '#ccc',
    padding: '4px 10px',
    cursor: 'pointer',
    fontSize: 13,
  },
  checkbox: {
    width: 20,
    height: 20,
    marginTop: 2,
    cursor: 'pointer',
    accentColor: '#e94560',
  },
};

export default function TaskItem({ task, onToggle, onEdit, onDelete }) {
  const formattedDate = new Date(task.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

  return (
    <div style={styles.card}>
      <input
        type="checkbox"
        checked={task.status === 'completed'}
        onChange={() => onToggle(task._id)}
        style={styles.checkbox}
      />
      <div style={styles.content}>
        <h3 style={styles.title(task.status === 'completed')}>{task.title}</h3>
        {task.description && <p style={styles.desc}>{task.description}</p>}
        <div style={styles.meta}>{formattedDate} &middot; {task.status}</div>
      </div>
      <div style={styles.actions}>
        <button style={styles.iconBtn} onClick={() => onEdit(task)}>Edit</button>
        <button style={{ ...styles.iconBtn, color: '#e94560', borderColor: '#e94560' }} onClick={() => onDelete(task._id)}>
          Delete
        </button>
      </div>
    </div>
  );
}
