import React from 'react';
import { Search, Bell, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import useUIStore from '../store/useUIStore';

const Navbar = ({ onMenuClick }) => {
  const { user } = useAuthStore();
  const { notifications, searchQuery, setSearchQuery } = useUIStore();
  const unread = notifications.filter(n => !n.read).length;
  const navigate = useNavigate();
  const avatarUrl = user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user?.name || 'user')}`;

  return (
    <header className="h-16 flex items-center px-6 gap-4 flex-shrink-0"
      style={{ background: 'rgba(21,24,33,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border-light)' }}>
      <button onClick={onMenuClick} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors flex-shrink-0">
        <Menu size={20} />
      </button>
      <div className="flex-1 max-w-md relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
        <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search tasks, projects, members..."
          className="w-full pl-9 pr-4 py-2 text-sm rounded-xl text-slate-300 placeholder-slate-500 outline-none"
          style={{ background: 'var(--bg-input)', border: '1px solid var(--border-light)' }} />
      </div>
      <div className="flex items-center gap-3 ml-auto">
        <button onClick={() => navigate('/notifications')} className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
          <Bell size={20} />
          {unread > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-violet-500 ring-2 ring-[var(--bg-card)]" />}
        </button>
        <button onClick={() => navigate('/settings')} className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-white/5 transition-colors">
          <img src={avatarUrl} className="w-8 h-8 rounded-full object-cover" alt="" style={{ background: '#1e2332' }} />
          <div className="hidden md:block text-left">
            <p className="text-sm font-semibold text-white leading-tight">{user?.name || 'User'}</p>
            <p className="text-xs text-slate-400 leading-tight">{user?.role || 'Member'}</p>
          </div>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
