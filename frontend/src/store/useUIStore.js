import { create } from 'zustand';

// This store is now used ONLY for ephemeral UI state that doesn't need persistence:
// notifications, search query, and sidebar state.
// All server data (projects, tasks, users) is fetched via React Query hooks.

const initialNotifications = [
  { id: 1, type: 'task_assigned', message: 'Sarah assigned you "Design new homepage hero section"', time: '2 min ago', read: false, icon: 'task' },
  { id: 2, type: 'mention', message: 'Marcus mentioned you in a comment on "Fix navigation bug"', time: '15 min ago', read: false, icon: 'mention' },
  { id: 3, type: 'deadline', message: '"Client Portal V2" deadline is approaching in 7 days', time: '1 hour ago', read: false, icon: 'deadline' },
  { id: 4, type: 'status', message: 'Priya changed "API Documentation" status to Completed', time: '3 hours ago', read: true, icon: 'status' },
  { id: 5, type: 'invite', message: 'You have been invited to join "Analytics Dashboard"', time: '1 day ago', read: true, icon: 'invite' },
];

const useUIStore = create((set) => ({
  notifications: initialNotifications,
  searchQuery: '',
  sidebarOpen: true,
  theme: localStorage.getItem('taskflow_theme') || 'Dark',
  accentColor: localStorage.getItem('taskflow_accent') || '#7c3aed',
  language: localStorage.getItem('taskflow_lang') || 'English (US)',

  setSearchQuery: (q) => set({ searchQuery: q }),
  setSidebarOpen: (v) => set({ sidebarOpen: v }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  
  setTheme: (t) => {
    localStorage.setItem('taskflow_theme', t);
    set({ theme: t });
  },
  setAccentColor: (c) => {
    localStorage.setItem('taskflow_accent', c);
    set({ accentColor: c });
  },
  setLanguage: (l) => {
    localStorage.setItem('taskflow_lang', l);
    set({ language: l });
  },

  markNotificationRead: (id) =>
    set((s) => ({
      notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    })),

  markAllNotificationsRead: () =>
    set((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, read: true })),
    })),

  pushNotification: (notification) =>
    set((s) => ({
      notifications: [{ ...notification, id: Date.now(), read: false, time: 'just now' }, ...s.notifications],
    })),
}));

export default useUIStore;
