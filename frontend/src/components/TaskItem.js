import React from 'react';

const styles = {
  wrapper: {
    marginBottom: 12,
  },
  entry: (done, isDragging) => ({
    background: done ? '#f8f6f0' : '#fff',
    borderRadius: 8,
    padding: '14px 16px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    cursor: 'grab',
    opacity: isDragging ? 0.4 : 1,
    transition: 'box-shadow 0.2s, opacity 0.15s',
    boxShadow: isDragging
      ? '0 8px 24px rgba(0,0,0,0.15)'
      : '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
    border: '1px solid #e8e0d0',
    borderLeft: done ? '4px solid #b0a090' : '4px solid #c9a96e',
    position: 'relative',
  }),
  dragHandle: {
    color: '#d5c8b5',
    cursor: 'grab',
    fontSize: 18,
    lineHeight: '24px',
    userSelect: 'none',
    flexShrink: 0,
    marginTop: 2,
  },
  checkbox: {
    width: 18,
    height: 18,
    marginTop: 3,
    cursor: 'pointer',
    accentColor: '#c9a96e',
    flexShrink: 0,
  },
  content: { flex: 1, minWidth: 0 },
  title: (done) => ({
    fontFamily: '"IBM Plex Serif", "Georgia", serif',
    fontSize: 17,
    fontWeight: 600,
    margin: 0,
    textDecoration: done ? 'line-through' : 'none',
    opacity: done ? 0.55 : 1,
    color: '#2c3e50',
    lineHeight: '26px',
    letterSpacing: '0.01em',
  }),
  desc: {
    fontFamily: '"IBM Plex Serif", "Georgia", serif',
    fontSize: 15,
    color: '#5a4e3e',
    margin: '4px 0 0',
    lineHeight: '24px',
  },
  meta: {
    fontFamily: '"Caveat", cursive',
    fontSize: 14,
    color: '#b0a090',
    marginTop: 6,
  },
  actions: { display: 'flex', gap: 6, flexShrink: 0, marginTop: 2 },
  iconBtn: {
    background: 'transparent',
    border: '1px solid #e0d8c8',
    borderRadius: 6,
    color: '#8a7a6a',
    padding: '4px 12px',
    cursor: 'pointer',
    fontSize: 13,
    fontFamily: '"IBM Plex Serif", "Georgia", serif',
    fontWeight: 600,
    transition: 'background 0.15s',
  },
};

export default function TaskItem({ task, onToggle, onEdit, onDelete, onDragStart, onDragOver, onDragEnd, isDragging }) {
  const formattedDate = new Date(task.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

  return (
    <div style={styles.wrapper}>
      <div
        style={styles.entry(task.status === 'completed', isDragging)}
        draggable
        onDragStart={(e) => { e.dataTransfer.setData('text/plain', task._id); onDragStart?.(task._id); }}
        onDragOver={(e) => { e.preventDefault(); onDragOver?.(task._id); }}
        onDragEnd={onDragEnd}
      >
        <div style={styles.dragHandle}>&#x2630;</div>
        <input
          type="checkbox"
          checked={task.status === 'completed'}
          onChange={() => onToggle(task._id)}
          style={styles.checkbox}
        />
        <div style={styles.content}>
          <div style={styles.title(task.status === 'completed')}>{task.title}</div>
          {task.description && <div style={styles.desc}>{task.description}</div>}
          <div style={styles.meta}>{formattedDate}</div>
        </div>
        <div style={styles.actions}>
          <button style={styles.iconBtn} onClick={() => onEdit(task)}>Edit</button>
          <button style={{ ...styles.iconBtn, color: '#d35d5d', borderColor: '#d35d5d' }} onClick={() => onDelete(task._id)}>
            Del
          </button>
        </div>
      </div>
    </div>
  );
}
