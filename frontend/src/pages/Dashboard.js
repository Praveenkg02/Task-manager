import React, { useState, useEffect, useCallback } from 'react';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import { getTasks, getStats, createTask, updateTask, deleteTask, toggleTask, reorderTasks } from '../api/axios';
import { useToast } from '../context/ToastContext';

const styles = {
  wrapper: { minHeight: 'calc(100vh - 56px)', display: 'flex', justifyContent: 'center', padding: '30px 16px', background: 'var(--bg-page)' },
  notebook: { position: 'relative', width: '100%', maxWidth: 800, background: 'var(--bg-paper)', borderRadius: '4px 12px 12px 4px', boxShadow: '3px 3px 12px var(--shadow), inset 2px 0 0 var(--text-muted), inset -1px 0 0 var(--text-muted)', padding: '0 40px 32px 48px', minHeight: '70vh', borderLeft: '4px solid var(--accent)', position: 'relative', overflow: 'hidden' },
  ruledBg: { position: 'absolute', top: 0, left: 40, right: 0, bottom: 0, backgroundImage: 'linear-gradient(to right, #e8c8c8 1px, transparent 1px), repeating-linear-gradient(to bottom, transparent, transparent 31px, #dcd3c4 31px, #dcd3c4 32px)', backgroundSize: '40px 100%, 100% 32px', backgroundPosition: '60px 0, 0 0', pointerEvents: 'none', opacity: 0.4 },
  topTape: { position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 160, height: 28, background: '#d4c5a9', borderRadius: '0 0 6px 6px', opacity: 0.5 },
  header: { position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: 28, marginBottom: 8, borderBottom: '2px solid var(--accent)', paddingBottom: 8 },
  title: { fontFamily: '"Caveat", cursive', fontSize: 32, color: 'var(--text-primary)', margin: 0, fontWeight: 700 },
  date: { fontFamily: '"Caveat", cursive', fontSize: 18, color: 'var(--text-muted)' },
  content: { position: 'relative', zIndex: 1 },
  statsRow: { display: 'flex', gap: 10, marginBottom: 12, flexWrap: 'wrap' },
  statCard: (color) => ({
    flex: 1, minWidth: 100, background: 'var(--card-bg)', borderRadius: 8, padding: '10px 14px',
    boxShadow: '0 1px 3px var(--shadow)', borderLeft: `3px solid ${color}`,
  }),
  statNum: { fontFamily: '"Caveat", cursive', fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 },
  statLabel: { fontFamily: '"Caveat", cursive', fontSize: 14, color: 'var(--text-muted)', marginTop: 2 },
  filters: { display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', padding: '8px 0' },
  searchInput: { flex: 1, minWidth: 140, padding: '8px 14px', border: 'none', borderBottom: '2px dashed var(--accent)', background: 'transparent', color: 'var(--text-primary)', fontSize: 16, outline: 'none', fontFamily: '"IBM Plex Serif", serif' },
  select: { padding: '8px 14px', border: '2px dashed var(--accent)', borderRadius: 4, background: 'rgba(201,169,110,0.08)', color: 'var(--text-primary)', fontSize: 14, outline: 'none', fontFamily: '"IBM Plex Serif", serif', cursor: 'pointer' },
  spiral: { position: 'absolute', left: -14, top: 20, bottom: 20, display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', zIndex: 2 },
  ring: { width: 18, height: 18, borderRadius: '50%', border: '2px solid #8a7a6a', background: '#d4c5a9', boxShadow: 'inset 0 0 4px rgba(0,0,0,0.2)' },
  loader: { fontFamily: '"Caveat", cursive', fontSize: 20, color: 'var(--text-muted)', textAlign: 'center', padding: '40px 0' },
};

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [sort, setSort] = useState('');
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState(null);
  const toast = useToast();

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 8 };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      if (priorityFilter) params.priority = priorityFilter;
      if (sort) params.sort = sort;
      const { data } = await getTasks(params);
      setTasks(data.tasks);
      setPagination(data.pagination);
    } catch (err) {
      toast('Failed to load tasks', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter, priorityFilter, sort, toast]);

  const fetchStats = useCallback(async () => {
    try {
      const { data } = await getStats();
      setStats(data);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => { fetchTasks(); fetchStats(); }, [fetchTasks, fetchStats]);
  useEffect(() => { setPage(1); }, [search, statusFilter, priorityFilter, sort]);

  const handleCreate = async ({ title, description, priority, dueDate }) => {
    try {
      await createTask({ title, description, priority, dueDate });
      toast('Task created', 'success');
      fetchTasks(); fetchStats();
    } catch (err) {
      toast(err.response?.data?.message || 'Failed to create task', 'error');
    }
  };

  const handleUpdate = async ({ title, description, priority, dueDate }) => {
    try {
      await updateTask(editing._id, { title, description, priority, dueDate });
      setEditing(null);
      toast('Task updated', 'success');
      fetchTasks(); fetchStats();
    } catch (err) {
      toast(err.response?.data?.message || 'Failed to update task', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this entry?')) return;
    try {
      await deleteTask(id);
      toast('Task deleted', 'success');
      fetchTasks(); fetchStats();
    } catch (err) {
      toast('Failed to delete task', 'error');
    }
  };

  const handleToggle = async (id) => {
    try {
      await toggleTask(id);
      fetchTasks(); fetchStats();
    } catch (err) {
      toast('Failed to toggle task', 'error');
    }
  };

  const handleReorder = async (orderedIds) => {
    try {
      setTasks((prev) => { const map = new Map(prev.map((t) => [t._id, t])); return orderedIds.map((id) => map.get(id)).filter(Boolean); });
      await reorderTasks(orderedIds);
    } catch (err) { fetchTasks(); }
  };

  const handleSubmit = editing ? handleUpdate : handleCreate;
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div style={styles.wrapper}>
      <div style={styles.notebook}>
        <div style={styles.topTape} />
        <div style={styles.spiral}>{Array.from({ length: 14 }).map((_, i) => <div key={i} style={styles.ring} />)}</div>
        <div style={styles.ruledBg} />
        <div style={styles.content}>
          <div style={styles.header}>
            <h1 style={styles.title}>My Tasks</h1>
            <span style={styles.date}>{today}</span>
          </div>
          {stats && (
            <div style={styles.statsRow}>
              <div style={styles.statCard('#c9a96e')}><div style={styles.statNum}>{stats.total}</div><div style={styles.statLabel}>Total</div></div>
              <div style={styles.statCard('#4a7a5a')}><div style={styles.statNum}>{stats.completed}</div><div style={styles.statLabel}>Done</div></div>
              <div style={styles.statCard('#d4a040')}><div style={styles.statNum}>{stats.pending}</div><div style={styles.statLabel}>Pending</div></div>
              <div style={styles.statCard('#d35d5d')}><div style={styles.statNum}>{stats.overdue}</div><div style={styles.statLabel}>Overdue</div></div>
            </div>
          )}
          <TaskForm onSubmit={handleSubmit} editing={editing} onCancelEdit={() => setEditing(null)} />
          <div style={styles.filters}>
            <input style={styles.searchInput} placeholder="Search entries..." value={search} onChange={(e) => setSearch(e.target.value)} />
            <select style={styles.select} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">All</option><option value="pending">Pending</option><option value="completed">Completed</option>
            </select>
            <select style={styles.select} value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
              <option value="">All Priority</option><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option>
            </select>
            <select style={styles.select} value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="">Default</option><option value="-createdAt">Newest</option><option value="createdAt">Oldest</option>
              <option value="dueDate">Due Date</option><option value="priority">Priority</option>
            </select>
          </div>
          {loading ? (
            <div style={styles.loader}>Loading...</div>
          ) : (
            <TaskList tasks={tasks} loading={false} onToggle={handleToggle} onEdit={(task) => setEditing(task)}
              onDelete={handleDelete} pagination={pagination} onPageChange={setPage} onReorder={handleReorder} />
          )}
        </div>
      </div>
    </div>
  );
}
