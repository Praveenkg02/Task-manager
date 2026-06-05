import axios from 'axios';

const BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const API = axios.create({ baseURL: BASE });

API.interceptors.request.use((req) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user?.token) {
    req.headers.Authorization = `Bearer ${user.token}`;
  }
  return req;
});

export const login = (data) => API.post('/auth/login', data);
export const register = (data) => API.post('/auth/register', data);
export const getMe = () => API.get('/auth/me');
export const getTasks = (params) => API.get('/tasks', { params });
export const createTask = (data) => API.post('/tasks', data);
export const updateTask = (id, data) => API.put(`/tasks/${id}`, data);
export const deleteTask = (id) => API.delete(`/tasks/${id}`);
export const toggleTask = (id) => API.patch(`/tasks/${id}/toggle`);
export const reorderTasks = (orderedIds) => API.put('/tasks/reorder', { orderedIds });
export const forgotPassword = (email) => API.post('/auth/forgot-password', { email });
export const resetPassword = (email, otp, password) => API.post('/auth/reset-password', { email, otp, password });
export const getStats = () => API.get('/tasks/stats');
