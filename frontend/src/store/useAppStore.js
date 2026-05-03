import { create } from 'zustand';

const initialProjects = [
  { id: 1, name: 'Marketing Website Redesign', description: 'Complete overhaul of the company website with modern design.', status: 'In Progress', priority: 'High', progress: 65, team: [1, 2, 3], dueDate: '2026-06-15', color: '#3b82f6', tags: ['Design', 'Frontend'], tasks: 24, completedTasks: 16 },
  { id: 2, name: 'Q3 Mobile App Release', description: 'Launch the new mobile application for iOS and Android platforms.', status: 'At Risk', priority: 'Urgent', progress: 32, team: [1, 4, 5, 6], dueDate: '2026-05-30', color: '#ef4444', tags: ['Mobile', 'Backend'], tasks: 40, completedTasks: 13 },
  { id: 3, name: 'Client Portal V2', description: 'Second version of the client portal with enhanced features.', status: 'On Track', priority: 'Medium', progress: 89, team: [2, 3], dueDate: '2026-05-10', color: '#22c55e', tags: ['Portal', 'UI'], tasks: 18, completedTasks: 16 },
  { id: 4, name: 'Brand Guidelines', description: 'Create comprehensive brand guidelines documentation.', status: 'Completed', priority: 'Low', progress: 100, team: [5, 6], dueDate: '2026-04-20', color: '#a855f7', tags: ['Branding', 'Design'], tasks: 12, completedTasks: 12 },
  { id: 5, name: 'Analytics Dashboard', description: 'Build real-time analytics dashboard for business intelligence.', status: 'In Progress', priority: 'High', progress: 45, team: [1, 3, 4], dueDate: '2026-07-01', color: '#f59e0b', tags: ['Analytics', 'Data'], tasks: 30, completedTasks: 14 },
  { id: 6, name: 'API Integration Suite', description: 'Third-party API integration for payment and CRM systems.', status: 'On Track', priority: 'High', progress: 70, team: [2, 4], dueDate: '2026-06-20', color: '#06b6d4', tags: ['Backend', 'API'], tasks: 22, completedTasks: 15 },
];

const initialTasks = [
  { id: 1, title: 'Design new homepage hero section', description: 'Create a modern, engaging hero section with animated elements.', project: 1, projectName: 'Marketing Website Redesign', assignee: 1, reporter: 2, status: 'In Progress', priority: 'High', dueDate: '2026-05-20', labels: ['Design', 'Frontend'], estimatedHours: 8, timeTracked: 5, createdAt: '2026-05-01', order: 0 },
  { id: 2, title: 'Implement user authentication flow', description: 'JWT-based auth with refresh tokens and session management.', project: 2, projectName: 'Q3 Mobile App Release', assignee: 4, reporter: 1, status: 'Todo', priority: 'Urgent', dueDate: '2026-05-15', labels: ['Backend', 'Security'], estimatedHours: 12, timeTracked: 0, createdAt: '2026-05-02', order: 1 },
  { id: 3, title: 'Write API documentation', description: 'Document all REST endpoints using OpenAPI specification.', project: 6, projectName: 'API Integration Suite', assignee: 2, reporter: 3, status: 'Completed', priority: 'Medium', dueDate: '2026-05-05', labels: ['Docs', 'API'], estimatedHours: 6, timeTracked: 6, createdAt: '2026-04-28', order: 2 },
  { id: 4, title: 'Fix navigation bug on mobile', description: 'Hamburger menu not closing after selection on iOS Safari.', project: 1, projectName: 'Marketing Website Redesign', assignee: 3, reporter: 1, status: 'In Review', priority: 'High', dueDate: '2026-05-08', labels: ['Bug', 'Mobile'], estimatedHours: 3, timeTracked: 2, createdAt: '2026-05-01', order: 3 },
  { id: 5, title: 'Setup CI/CD pipeline', description: 'Automate build and deploy process using GitHub Actions.', project: 2, projectName: 'Q3 Mobile App Release', assignee: 5, reporter: 1, status: 'Backlog', priority: 'Medium', dueDate: '2026-06-01', labels: ['DevOps'], estimatedHours: 10, timeTracked: 0, createdAt: '2026-05-02', order: 4 },
  { id: 6, title: 'Conduct user testing session', description: 'Organize and run user testing for the new onboarding flow.', project: 3, projectName: 'Client Portal V2', assignee: 6, reporter: 2, status: 'Todo', priority: 'Low', dueDate: '2026-05-25', labels: ['UX', 'Testing'], estimatedHours: 4, timeTracked: 0, createdAt: '2026-05-03', order: 5 },
  { id: 7, title: 'Optimize database queries', description: 'Add indexes and optimize slow queries in the analytics module.', project: 5, projectName: 'Analytics Dashboard', assignee: 4, reporter: 3, status: 'In Progress', priority: 'High', dueDate: '2026-05-18', labels: ['Backend', 'Performance'], estimatedHours: 8, timeTracked: 3, createdAt: '2026-05-01', order: 6 },
  { id: 8, title: 'Create email notification templates', description: 'Design HTML email templates for system notifications.', project: 1, projectName: 'Marketing Website Redesign', assignee: 2, reporter: 1, status: 'Blocked', priority: 'Medium', dueDate: '2026-05-12', labels: ['Email', 'Design'], estimatedHours: 5, timeTracked: 1, createdAt: '2026-04-29', order: 7 },
  { id: 9, title: 'Setup monitoring and alerts', description: 'Configure Datadog monitoring and PagerDuty alert routing.', project: 2, projectName: 'Q3 Mobile App Release', assignee: 5, reporter: 4, status: 'Todo', priority: 'High', dueDate: '2026-05-28', labels: ['DevOps', 'Monitoring'], estimatedHours: 6, timeTracked: 0, createdAt: '2026-05-03', order: 8 },
  { id: 10, title: 'Implement dark mode toggle', description: 'Add persistent dark/light mode preference across the app.', project: 3, projectName: 'Client Portal V2', assignee: 3, reporter: 2, status: 'Completed', priority: 'Low', dueDate: '2026-04-30', labels: ['Frontend', 'UI'], estimatedHours: 4, timeTracked: 4, createdAt: '2026-04-25', order: 9 },
];

const initialMembers = [
  { id: 1, name: 'Alex Johnson', email: 'alex@taskflow.io', role: 'Admin', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex', status: 'online', department: 'Engineering', tasksCompleted: 48, projects: 5 },
  { id: 2, name: 'Sarah Chen', email: 'sarah@taskflow.io', role: 'Manager', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', status: 'online', department: 'Design', tasksCompleted: 62, projects: 4 },
  { id: 3, name: 'Marcus Williams', email: 'marcus@taskflow.io', role: 'Team Lead', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus', status: 'away', department: 'Engineering', tasksCompleted: 35, projects: 3 },
  { id: 4, name: 'Priya Patel', email: 'priya@taskflow.io', role: 'Member', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya', status: 'online', department: 'Backend', tasksCompleted: 41, projects: 3 },
  { id: 5, name: 'Jordan Lee', email: 'jordan@taskflow.io', role: 'Member', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan', status: 'offline', department: 'DevOps', tasksCompleted: 29, projects: 2 },
  { id: 6, name: 'Emma Rodriguez', email: 'emma@taskflow.io', role: 'Guest', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma', status: 'online', department: 'QA', tasksCompleted: 18, projects: 2 },
];

const initialNotifications = [
  { id: 1, type: 'task_assigned', message: 'Sarah assigned you "Design new homepage hero section"', time: '2 min ago', read: false, icon: 'task' },
  { id: 2, type: 'mention', message: 'Marcus mentioned you in a comment on "Fix navigation bug"', time: '15 min ago', read: false, icon: 'mention' },
  { id: 3, type: 'deadline', message: '"Client Portal V2" deadline is approaching in 7 days', time: '1 hour ago', read: false, icon: 'deadline' },
  { id: 4, type: 'status', message: 'Priya changed "API Documentation" status to Completed', time: '3 hours ago', read: true, icon: 'status' },
  { id: 5, type: 'invite', message: 'You have been invited to join "Analytics Dashboard"', time: '1 day ago', read: true, icon: 'invite' },
];

const useAppStore = create((set, get) => ({
  projects: initialProjects,
  tasks: initialTasks,
  members: initialMembers,
  notifications: initialNotifications,
  searchQuery: '',
  activeProjectId: null,

  setSearchQuery: (q) => set({ searchQuery: q }),
  setActiveProject: (id) => set({ activeProjectId: id }),

  addProject: (project) => set((s) => ({
    projects: [...s.projects, { ...project, id: Date.now(), progress: 0, tasks: 0, completedTasks: 0, team: [1] }]
  })),

  updateProject: (id, updates) => set((s) => ({
    projects: s.projects.map((p) => p.id === id ? { ...p, ...updates } : p)
  })),

  deleteProject: (id) => set((s) => ({
    projects: s.projects.filter((p) => p.id !== id)
  })),

  addTask: (task) => set((s) => ({
    tasks: [...s.tasks, { ...task, id: Date.now(), timeTracked: 0, createdAt: new Date().toISOString().split('T')[0], order: s.tasks.length }]
  })),

  updateTask: (id, updates) => set((s) => ({
    tasks: s.tasks.map((t) => t.id === id ? { ...t, ...updates } : t)
  })),

  deleteTask: (id) => set((s) => ({
    tasks: s.tasks.filter((t) => t.id !== id)
  })),

  moveTask: (taskId, newStatus) => set((s) => ({
    tasks: s.tasks.map((t) => t.id === taskId ? { ...t, status: newStatus } : t)
  })),

  markNotificationRead: (id) => set((s) => ({
    notifications: s.notifications.map((n) => n.id === id ? { ...n, read: true } : n)
  })),

  markAllNotificationsRead: () => set((s) => ({
    notifications: s.notifications.map((n) => ({ ...n, read: true }))
  })),
}));

export default useAppStore;
