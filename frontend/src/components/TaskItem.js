import React from 'react';

const styles = {
  entry: (done, isDragging) => ({
    padding: '10px 0 10px 8px',
    borderBottom: '1px solid #e8e0d0',
    display: 'flex',
    alignItems: 'flex-start',
    gap: 10,
    opacity: isDragging ? 0.4 : 1,
    cursor: 'grab',
    transition: 'opacity 0.15s',
    borderLeft: '3px solid transparent',
    borderLeftColor: isDragging ? '#c9a96e' : 'transparent',
    background: isDragging ? 'rgba(201,169,110,0.06)' : 'transparent',
  }),
  dragHandle: {
    color: '#c9a96e',
    cursor: 'grab',
    fontSize: 20,
    lineHeight: '28px',
    userSelect: 'none',
    opacity: 0.4,
    flexShrink: 0,
  },
  checkbox: {
    width: 18,
    height: 18,
    marginTop: 4,
    cursor: 'pointer',
    accentColor: '#c9a96e',
    flexShrink: 0,
  },
  content: { flex: 1, minWidth: 0 },
  title: (done) => ({
    fontFamily: '"Caveat", cursive',
    fontSize: 20,
    fontWeight: 600,
    margin: 0,
    textDecoration: done ? 'line-through' : 'none',
    opacity: done ? 0.5 : 1,
    color: '#2c3e50',
    lineHeight: '32px',
  }),
  desc: {
    fontFamily: '"Caveat", cursive',
    fontSize: 17,
    color: '#6b5e4e',
    margin: '2px 0 0',
    lineHeight: '24px',
  },
  meta: {
    fontFamily: '"Caveat", cursive',
    fontSize: 14,
    color: '#b0a090',
    marginTop: 2,
  },
  actions: { display: 'flex', gap: 4, flexShrink: 0, marginTop: 4 },
  iconBtn: {
    background: 'transparent',
    border: '1px solid #dcd3c4',
    borderRadius: 4,
    color: '#8a7a6a',
    padding: '2px 10px',
    cursor: 'pointer',
    fontSize: 14,
    fontFamily: '"Caveat", cursive',
    fontWeight: 600,
  },
};

export default function TaskItem({ task, onToggle, onEdit, onDelete, onDragStart, onDragOver, onDragEnd, isDragging }) {
  const formattedDate = new Date(task.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

  return (
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
  );
}
