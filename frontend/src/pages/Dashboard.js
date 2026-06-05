import React, { useState, useEffect, useCallback } from 'react';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import { getTasks, createTask, updateTask, deleteTask, toggleTask, reorderTasks } from '../api/axios';

const styles = {
  container: {
    maxWidth: 720,
    margin: '0 auto',
    padding: '24px 16px',
    minHeight: 'calc(100vh - 60px)',
    background: '#1a1a2e',
  },
  title: { color: '#fff', fontSize: 22, margin: '0 0 20px' },
  filters: {
    display: 'flex',
    gap: 10,
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  searchInput: {
    flex: 1,
    minWidth: 180,
    padding: '8px 14px',
    borderRadius: 6,
    border: '1px solid #0f3460',
    background: '#16213e',
    color: '#fff',
    fontSize: 14,
    outline: 'none',
  },
  select: {
    padding: '8px 14px',
    borderRadius: 6,
    border: '1px solid #0f3460',
    background: '#16213e',
    color: '#fff',
    fontSize: 14,
    outline: 'none',
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
    if (!window.confirm('Delete this task?')) return;
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

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Dashboard</h1>
      <TaskForm onSubmit={handleSubmit} editing={editing} onCancelEdit={() => setEditing(null)} />
      <div style={styles.filters}>
        <input
          style={styles.searchInput}
          placeholder="Search tasks..."
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
  );
}
