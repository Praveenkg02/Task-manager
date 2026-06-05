import React, { useState, useEffect, useCallback } from 'react';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import { getTasks, createTask, updateTask, deleteTask, toggleTask, reorderTasks } from '../api/axios';

const styles = {
  wrapper: {
    minHeight: 'calc(100vh - 56px)',
    display: 'flex',
    justifyContent: 'center',
    padding: '30px 16px',
    background: '#e8e0d0',
  },
  notebook: {
    position: 'relative',
    width: '100%',
    maxWidth: 800,
    background: '#faf6ef',
    borderRadius: '4px 12px 12px 4px',
    boxShadow:
      '3px 3px 12px rgba(0,0,0,0.12), inset 2px 0 0 #d5c8b5, inset -1px 0 0 #d5c8b5',
    padding: '0 40px 32px 48px',
    minHeight: '70vh',
    borderLeft: '4px solid #c9a96e',
    position: 'relative',
    overflow: 'hidden',
  },
  ruledBg: {
    position: 'absolute',
    top: 0,
    left: 40,
    right: 0,
    bottom: 0,
    backgroundImage: `
      linear-gradient(to right, #e8c8c8 1px, transparent 1px),
      repeating-linear-gradient(to bottom, transparent, transparent 31px, #dcd3c4 31px, #dcd3c4 32px)
    `,
    backgroundSize: '40px 100%, 100% 32px',
    backgroundPosition: '60px 0, 0 0',
    pointerEvents: 'none',
    opacity: 0.6,
  },
  topTape: {
    position: 'absolute',
    top: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: 160,
    height: 28,
    background: '#d4c5a9',
    borderRadius: '0 0 6px 6px',
    opacity: 0.5,
  },
  header: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingTop: 28,
    marginBottom: 8,
    borderBottom: '2px solid #c9a96e',
    paddingBottom: 8,
  },
  title: {
    fontFamily: '"Caveat", cursive',
    fontSize: 32,
    color: '#3b2f2a',
    margin: 0,
    fontWeight: 700,
  },
  date: {
    fontFamily: '"Caveat", cursive',
    fontSize: 18,
    color: '#8a7a6a',
  },
  content: { position: 'relative', zIndex: 1 },
  filters: {
    display: 'flex',
    gap: 10,
    marginBottom: 16,
    flexWrap: 'wrap',
    padding: '8px 0',
  },
  searchInput: {
    flex: 1,
    minWidth: 160,
    padding: '8px 14px',
    border: 'none',
    borderBottom: '2px dashed #c9a96e',
    background: 'transparent',
    color: '#2c3e50',
    fontSize: 16,
    outline: 'none',
    fontFamily: '"IBM Plex Serif", serif',
  },
  select: {
    padding: '8px 14px',
    border: '2px dashed #c9a96e',
    borderRadius: 4,
    background: 'rgba(201,169,110,0.08)',
    color: '#2c3e50',
    fontSize: 15,
    outline: 'none',
    fontFamily: '"IBM Plex Serif", serif',
    cursor: 'pointer',
  },
  spiral: {
    position: 'absolute',
    left: -14,
    top: 20,
    bottom: 20,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    zIndex: 2,
  },
  ring: {
    width: 18,
    height: 18,
    borderRadius: '50%',
    border: '2px solid #8a7a6a',
    background: '#d4c5a9',
    boxShadow: 'inset 0 0 4px rgba(0,0,0,0.2)',
  },
};

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 8 };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      const { data } = await getTasks(params);
      setTasks(data.tasks);
      setPagination(data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);
  useEffect(() => { setPage(1); }, [search, statusFilter]);

  const handleCreate = async ({ title, description }) => {
    try {
      await createTask({ title, description });
      fetchTasks();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create task');
    }
  };

  const handleUpdate = async ({ title, description }) => {
    try {
      await updateTask(editing._id, { title, description });
      setEditing(null);
      fetchTasks();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update task');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this entry?')) return;
    try {
      await deleteTask(id);
      fetchTasks();
    } catch (err) {
      alert('Failed to delete task');
    }
  };

  const handleToggle = async (id) => {
    try {
      await toggleTask(id);
      fetchTasks();
    } catch (err) {
      alert('Failed to toggle task');
    }
  };

  const handleReorder = async (orderedIds) => {
    try {
      setTasks((prev) => {
        const map = new Map(prev.map((t) => [t._id, t]));
        return orderedIds.map((id) => map.get(id)).filter(Boolean);
      });
      await reorderTasks(orderedIds);
    } catch (err) {
      fetchTasks();
    }
  };

  const handleSubmit = editing ? handleUpdate : handleCreate;
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div style={styles.wrapper}>
      <div style={styles.notebook}>
        <div style={styles.topTape} />
        <div style={styles.spiral}>
          {Array.from({ length: 14 }).map((_, i) => <div key={i} style={styles.ring} />)}
        </div>
        <div style={styles.ruledBg} />
        <div style={styles.content}>
          <div style={styles.header}>
            <h1 style={styles.title}>My Tasks</h1>
            <span style={styles.date}>{today}</span>
          </div>
          <TaskForm onSubmit={handleSubmit} editing={editing} onCancelEdit={() => setEditing(null)} />
          <div style={styles.filters}>
            <input
              style={styles.searchInput}
              placeholder="Search entries..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select style={styles.select} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <TaskList
            tasks={tasks}
            loading={loading}
            onToggle={handleToggle}
            onEdit={(task) => setEditing(task)}
            onDelete={handleDelete}
            pagination={pagination}
            onPageChange={setPage}
            onReorder={handleReorder}
          />
        </div>
      </div>
    </div>
  );
}
