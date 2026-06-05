import React from 'react';

const priorityColors = { low: '#6b8e6b', medium: '#c9a96e', high: '#d35d5d' };
const priorityLabels = { low: 'Low', medium: 'Med', high: 'High' };

const styles = {
  wrapper: { marginBottom: 12 },
  entry: (done, isDragging) => ({
    background: done ? 'var(--bg-paper)' : 'var(--card-bg)', borderRadius: 8, padding: '14px 16px',
    display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'grab',
    opacity: isDragging ? 0.4 : 1, transition: 'box-shadow 0.2s, opacity 0.15s',
    boxShadow: isDragging ? '0 8px 24px var(--shadow)' : '0 1px 3px var(--shadow), 0 1px 2px var(--shadow)',
    border: '1px solid var(--border-paper)',
    borderLeft: done ? '4px solid #b0a090' : '4px solid var(--accent)',
    position: 'relative',
  }),
  dragHandle: { color: 'var(--text-muted)', cursor: 'grab', fontSize: 18, lineHeight: '24px', userSelect: 'none', flexShrink: 0, marginTop: 2 },
  checkbox: { width: 18, height: 18, marginTop: 3, cursor: 'pointer', accentColor: 'var(--accent)', flexShrink: 0 },
  content: { flex: 1, minWidth: 0 },
  title: (done) => ({
    fontFamily: '"IBM Plex Serif", "Georgia", serif', fontSize: 17, fontWeight: 600,
    margin: 0, textDecoration: done ? 'line-through' : 'none', opacity: done ? 0.55 : 1,
    color: 'var(--text-primary)', lineHeight: '26px', letterSpacing: '0.01em',
  }),
  desc: { fontFamily: '"IBM Plex Serif", "Georgia", serif', fontSize: 15, color: 'var(--text-secondary)', margin: '4px 0 0', lineHeight: '24px' },
  meta: { fontFamily: '"Caveat", cursive', fontSize: 14, color: 'var(--text-muted)', marginTop: 6, display: 'flex', gap: 12, alignItems: 'center' },
  badge: (color) => ({
    display: 'inline-block', padding: '1px 8px', borderRadius: 10, fontSize: 11,
    fontFamily: '"IBM Plex Serif", serif', fontWeight: 700, color: '#fff',
    background: color, letterSpacing: '0.5px',
  }),
  overdue: { color: '#d35d5d', fontWeight: 600 },
  actions: { display: 'flex', gap: 6, flexShrink: 0, marginTop: 2, flexWrap: 'wrap', justifyContent: 'flex-end' },
  iconBtn: { background: 'transparent', border: '1px solid var(--border-paper)', borderRadius: 6, color: 'var(--text-muted)', padding: '4px 12px', cursor: 'pointer', fontSize: 13, fontFamily: '"IBM Plex Serif", "Georgia", serif', fontWeight: 600, transition: 'background 0.15s' },
};

export default function TaskItem({ task, onToggle, onEdit, onDelete, onDragStart, onDragOver, onDragEnd, isDragging }) {
  const createdDate = new Date(task.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';
  const dueStr = task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : null;

  return (
    <div style={styles.wrapper}>
      <div style={styles.entry(task.status === 'completed', isDragging)} draggable
        onDragStart={(e) => { e.dataTransfer.setData('text/plain', task._id); onDragStart?.(task._id); }}
        onDragOver={(e) => { e.preventDefault(); onDragOver?.(task._id); }} onDragEnd={onDragEnd}>
        <div style={styles.dragHandle}>&#x2630;</div>
        <input type="checkbox" checked={task.status === 'completed'} onChange={() => onToggle(task._id)} style={styles.checkbox} />
        <div style={styles.content}>
          <div style={styles.title(task.status === 'completed')}>{task.title}</div>
          {task.description && <div style={styles.desc}>{task.description}</div>}
          <div style={styles.meta}>
            <span style={styles.badge(priorityColors[task.priority] || '#b0a090')}>{priorityLabels[task.priority] || task.priority}</span>
            <span>{createdDate}</span>
            {dueStr && <span style={isOverdue ? styles.overdue : {}}>{isOverdue ? '\u26A0 ' : ''}Due: {dueStr}</span>}
          </div>
        </div>
        <div style={styles.actions}>
          <button style={styles.iconBtn} onClick={() => onEdit(task)}>Edit</button>
          <button style={{ ...styles.iconBtn, color: '#d35d5d', borderColor: '#d35d5d' }} onClick={() => onDelete(task._id)}>Del</button>
        </div>
      </div>
    </div>
  );
}
