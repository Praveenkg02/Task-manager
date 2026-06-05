import React, { useState, useCallback } from 'react';
import TaskItem from './TaskItem';

const styles = {
  list: { position: 'relative' },
  empty: {
    fontFamily: '"Caveat", cursive',
    fontSize: 20,
    color: '#b0a090',
    textAlign: 'center',
    padding: '40px 0',
    lineHeight: '32px',
  },
  loader: {
    fontFamily: '"Caveat", cursive',
    fontSize: 20,
    color: '#b0a090',
    textAlign: 'center',
    padding: '40px 0',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 20,
    flexWrap: 'wrap',
  },
  pageBtn: {
    background: 'transparent',
    border: '1px solid #dcd3c4',
    borderRadius: 4,
    color: '#6b5e4e',
    padding: '4px 14px',
    cursor: 'pointer',
    fontSize: 15,
    fontFamily: '"Caveat", cursive',
    fontWeight: 600,
  },
  activePage: { background: '#c9a96e', color: '#fff', borderColor: '#c9a96e' },
  pageInfo: { fontFamily: '"Caveat", cursive', fontSize: 15, color: '#b0a090' },
};

export default function TaskList({ tasks, loading, onToggle, onEdit, onDelete, pagination, onPageChange, onReorder }) {
  const [dragId, setDragId] = useState(null);
  const [overId, setOverId] = useState(null);

  const handleDragStart = useCallback((id) => { setDragId(id); }, []);
  const handleDragOver = useCallback((id) => { setOverId(id); }, []);

  const handleDragEnd = useCallback(() => {
    if (dragId && overId && dragId !== overId) {
      const list = [...tasks];
      const fromIdx = list.findIndex((t) => t._id === dragId);
      const toIdx = list.findIndex((t) => t._id === overId);
      if (fromIdx !== -1 && toIdx !== -1) {
        const [moved] = list.splice(fromIdx, 1);
        list.splice(toIdx, 0, moved);
        onReorder(list.map((t) => t._id));
      }
    }
    setDragId(null);
    setOverId(null);
  }, [dragId, overId, tasks, onReorder]);

  if (loading) return <div style={styles.loader}>Turning pages...</div>;
  if (!tasks || tasks.length === 0) return <div style={styles.empty}>Nothing written yet. Add your first task above.</div>;

  return (
    <div style={styles.list}>
      {tasks.map((task) => (
        <TaskItem
          key={task._id}
          task={task}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          isDragging={dragId === task._id}
        />
      ))}
      {pagination && pagination.pages > 1 && (
        <div style={styles.pagination}>
          <button
            style={styles.pageBtn}
            disabled={pagination.page <= 1}
            onClick={() => onPageChange(pagination.page - 1)}
          >
            Prev
          </button>
          {Array.from({ length: pagination.pages }, (_, i) => (
            <button
              key={i + 1}
              style={{ ...styles.pageBtn, ...(pagination.page === i + 1 ? styles.activePage : {}) }}
              onClick={() => onPageChange(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            style={styles.pageBtn}
            disabled={pagination.page >= pagination.pages}
            onClick={() => onPageChange(pagination.page + 1)}
          >
            Next
          </button>
          <span style={styles.pageInfo}>Page {pagination.page} of {pagination.pages}</span>
        </div>
      )}
    </div>
  );
}
