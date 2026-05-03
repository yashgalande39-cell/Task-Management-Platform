import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Briefcase, CheckSquare, Columns, Calendar, Users, BarChart2, Bell, Settings, LogOut, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../store/useAuthStore';
import useUIStore from '../store/useUIStore';

const links = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Projects', path: '/projects', icon: Briefcase },
  { name: 'My Tasks', path: '/tasks', icon: CheckSquare },
  { name: 'Board', path: '/board', icon: Columns },
  { name: 'Calendar', path: '/calendar', icon: Calendar },
  { name: 'Team', path: '/team', icon: Users },
  { name: 'Analytics', path: '/analytics', icon: BarChart2 },
];

const Sidebar = ({ open, setOpen }) => {
  const location = useLocation();
  const { logout, user } = useAuthStore();
  const { notifications } = useUIStore();
  const unread = notifications.filter(n => !n.read).length;
  const avatarUrl = user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user?.name || 'user')}`;

  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.aside
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 260, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          className="h-full flex-shrink-0 flex flex-col overflow-hidden"
          style={{ background: 'var(--bg-card)', borderRight: '1px solid var(--border-light)' }}>

          {/* Logo */}
          <div className="flex items-center justify-between px-5 h-16 flex-shrink-0">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-white text-lg" style={{ background: 'linear-gradient(135deg,var(--primary),#3b82f6)' }}>T</div>
              <span className="font-bold text-lg tracking-tight text-white">TaskFlow</span>
            </Link>
            <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
              <ChevronLeft size={16} />
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
            {links.map(link => {
              const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
              const Icon = link.icon;
              return (
                <Link key={link.name} to={link.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive ? 'text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                  style={isActive ? { background: 'linear-gradient(135deg,rgba(var(--primary-rgb),0.3),rgba(59,130,246,0.2))', boxShadow: 'inset 0 0 0 1px rgba(var(--primary-rgb),0.3)' } : {}}>
                  <Icon size={18} className={isActive ? 'text-violet-400' : ''} />
                  {link.name}
                </Link>
              );
            })}

            {/* Notifications */}
            <Link to="/notifications"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${location.pathname === '/notifications' ? 'text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
              style={location.pathname === '/notifications' ? { background: 'linear-gradient(135deg,rgba(var(--primary-rgb),0.3),rgba(59,130,246,0.2))', boxShadow: 'inset 0 0 0 1px rgba(var(--primary-rgb),0.3)' } : {}}>
              <Bell size={18} className={location.pathname === '/notifications' ? 'text-violet-400' : ''} />
              Notifications
              {unread > 0 && <span className="ml-auto text-xs font-bold bg-violet-500 text-white rounded-full w-5 h-5 flex items-center justify-center">{unread}</span>}
            </Link>
          </nav>

          {/* Bottom */}
          <div className="p-3 border-t" style={{ borderColor: 'var(--border-light)' }}>
            <Link to="/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all">
              <Settings size={18} /> Settings
            </Link>
            <button onClick={logout} className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all mt-1">
              <LogOut size={18} /> Logout
            </button>
            <div className="flex items-center gap-3 px-3 mt-3 pt-3" style={{ borderTop: '1px solid var(--border-light)' }}>
              <img src={avatarUrl} className="w-8 h-8 rounded-full object-cover bg-slate-700" alt="" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate">{user?.name || 'User'}</p>
                <p className="text-xs text-slate-400 truncate">{user?.role || 'Member'}</p>
              </div>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
