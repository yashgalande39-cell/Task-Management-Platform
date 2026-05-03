import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useAuthStore from './store/useAuthStore';
import Layout from './components/Layout';
import useUIStore from './store/useUIStore';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Projects = lazy(() => import('./pages/Projects'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const Tasks = lazy(() => import('./pages/Tasks'));
const Board = lazy(() => import('./pages/Board'));
const Calendar = lazy(() => import('./pages/Calendar'));
const Team = lazy(() => import('./pages/Team'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Notifications = lazy(() => import('./pages/Notifications'));
const Settings = lazy(() => import('./pages/Settings'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don't retry on auth errors
        if (error?.response?.status === 401) return false;
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
      staleTime: 30_000,
    },
  },
});


const ProtectedRoute = ({ children }) => {
  const { user } = useAuthStore();
  if (!user) return <Navigate to="/login" replace />;
  return <Layout>{children}</Layout>;
};

const ThemeApplier = () => {
  const { theme, accentColor } = useUIStore();
  React.useEffect(() => {
    let r = 124, g = 58, b = 237;
    if (accentColor.match(/^#[0-9a-f]{6}$/i)) {
      r = parseInt(accentColor.slice(1,3), 16);
      g = parseInt(accentColor.slice(3,5), 16);
      b = parseInt(accentColor.slice(5,7), 16);
    }
    document.documentElement.style.setProperty('--primary', accentColor);
    document.documentElement.style.setProperty('--primary-rgb', `${r}, ${g}, ${b}`);
    if (theme === 'Light') {
      document.documentElement.classList.add('light-mode');
    } else {
      document.documentElement.classList.remove('light-mode');
    }
  }, [theme, accentColor]);
  return null;
};

const Loader = () => (
  <div className="flex h-screen items-center justify-center" style={{ background: 'var(--bg-default, var(--bg-app))' }}>
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-2xl animate-pulse" style={{ background: 'linear-gradient(135deg, var(--primary), #3b82f6)', boxShadow: '0 4px 20px rgba(var(--primary-rgb), 0.4)' }}>T</div>
      <div className="flex gap-1">
        <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: 'var(--primary)', animationDelay:'0ms'}}/>
        <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: '#3b82f6', animationDelay:'150ms'}}/>
        <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: '#06b6d4', animationDelay:'300ms'}}/>
      </div>
    </div>
  </div>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeApplier />
      <Router>
        <Suspense fallback={<Loader />}>

          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
            <Route path="/projects/:id" element={<ProtectedRoute><ProjectDetail /></ProtectedRoute>} />
            <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
            <Route path="/board" element={<ProtectedRoute><Board /></ProtectedRoute>} />
            <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
            <Route path="/team" element={<ProtectedRoute><Team /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
