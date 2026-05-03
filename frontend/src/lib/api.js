import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const stored = localStorage.getItem('tf_user');
    if (stored) {
      try {
        const user = JSON.parse(stored);
        if (user?.token) config.headers.Authorization = `Bearer ${user.token}`;
      } catch {}
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Global response error handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired — clear auth and redirect
      localStorage.removeItem('tf_user');
      window.location.href = '/login';
    }
    return Promise.reject(error?.response?.data || error);
  }
);

// ── Auth ────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// ── Projects ────────────────────────────────────────────────────
export const projectAPI = {
  getAll: (params) => api.get('/projects', { params }),
  getById: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post('/projects', data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
  addMember: (id, userId) => api.post(`/projects/${id}/members`, { userId }),
};

// ── Tasks ───────────────────────────────────────────────────────
export const taskAPI = {
  getAll: (params) => api.get('/tasks', { params }),
  getById: (id) => api.get(`/tasks/${id}`),
  create: (data) => api.post('/tasks', data),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  delete: (id) => api.delete(`/tasks/${id}`),
  addComment: (id, text) => api.post(`/tasks/${id}/comments`, { text }),
};

// ── Users / Team ─────────────────────────────────────────────────
export const userAPI = {
  getAll: () => api.get('/users'),
  updateProfile: (data) => api.put('/users/me', data),
  getAnalytics: () => api.get('/users/analytics'),
};

export default api;
