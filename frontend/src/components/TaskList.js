import React, { useState, useCallback } from 'react';
import TaskItem from './TaskItem';

const styles = {
  container: { display: 'flex', flexDirection: 'column', gap: 10 },
  empty: { textAlign: 'center', color: '#666', padding: 40, fontSize: 15 },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
  },
  pageBtn: {
    background: '#16213e',
    border: '1px solid #0f3460',
    color: '#fff',
    padding: '6px 14px',
    borderRadius: 6,
    cursor: 'pointer',
    fontSize: 13,
  },
  activePage: { background: '#e94560', borderColor: '#e94560' },
  pageInfo: { color: '#a0a0b0', fontSize: 13 },
};

export default function TaskList({ tasks, loading, onToggle, onEdit, onDelete, pagination, onPageChange, onReorder }) {
  const [dragId, setDragId] = useState(null);
  const [overId, setOverId] = useState(null);

  const handleDragStart = useCallback((id) => {
    setDragId(id);
  }, []);

  const handleDragOver = useCallback((id) => {
    setOverId(id);
  }, []);

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

  if (loading) return <div style={styles.empty}>Loading tasks...</div>;
  if (!tasks || tasks.length === 0) return <div style={styles.empty}>No tasks found</div>;

  return (
    <div>
      <div style={styles.container}>
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
      </div>
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
