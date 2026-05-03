import { create } from 'zustand';
import { authAPI } from '../lib/api';
import { connectSocket, disconnectSocket } from '../lib/socket';

const parseUser = () => {
  try {
    return JSON.parse(localStorage.getItem('tf_user'));
  } catch {
    return null;
  }
};

const useAuthStore = create((set, get) => ({
  user: parseUser(),
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { data } = await authAPI.login({ email, password });
      localStorage.setItem('tf_user', JSON.stringify(data));
      set({ user: data, loading: false });
      connectSocket(); // Connect WebSocket on login
      return { success: true };
    } catch (err) {
      const msg = err?.message || 'Invalid email or password';
      set({ error: msg, loading: false });
      return { success: false, message: msg };
    }
  },

  register: async (name, email, password) => {
    set({ loading: true, error: null });
    try {
      const { data } = await authAPI.register({ name, email, password });
      localStorage.setItem('tf_user', JSON.stringify(data));
      set({ user: data, loading: false });
      connectSocket();
      return { success: true };
    } catch (err) {
      const msg = err?.message || 'Registration failed';
      set({ error: msg, loading: false });
      return { success: false, message: msg };
    }
  },

  logout: () => {
    localStorage.removeItem('tf_user');
    disconnectSocket();
    set({ user: null, error: null });
  },

  updateUser: (updates) => {
    const updated = { ...get().user, ...updates };
    localStorage.setItem('tf_user', JSON.stringify(updated));
    set({ user: updated });
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;
