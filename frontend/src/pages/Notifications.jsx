import React from 'react';
import { motion } from 'framer-motion';
import { Bell, CheckSquare, AtSign, Clock, RefreshCw, MessageSquare, Check, CheckCheck } from 'lucide-react';
import useUIStore from '../store/useUIStore';

const iconMap = { task: CheckSquare, mention: AtSign, deadline: Clock, status: RefreshCw, invite: MessageSquare };
const iconColors = { task: 'var(--primary)', mention: '#3b82f6', deadline: '#f59e0b', status: '#22c55e', invite: '#06b6d4' };

const Notifications = () => {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useUIStore();
  const unread = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Notifications</h1>
          <p className="text-slate-400 mt-1">{unread} unread notification{unread !== 1 ? 's' : ''}</p>
        </div>
        {unread > 0 && (
          <button onClick={markAllNotificationsRead} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-violet-400 hover:text-violet-300 transition-colors" style={{ border: '1px solid rgba(var(--primary-rgb),0.3)' }}>
            <CheckCheck size={16} /> Mark all as read
          </button>
        )}
      </div>

      <div className="space-y-2">
        {notifications.map((n, i) => {
          const Icon = iconMap[n.icon] || Bell;
          return (
            <motion.div key={n.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
              className="flex items-start gap-4 p-4 rounded-2xl cursor-pointer group transition-all" style={{ background: n.read ? 'var(--bg-card)' : 'rgba(var(--primary-rgb),0.1)', border: n.read ? '1px solid var(--border-light)' : '1px solid rgba(var(--primary-rgb),0.25)' }}
              onClick={() => markNotificationRead(n.id)}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${iconColors[n.icon] || '#64748b'}20` }}>
                <Icon size={18} style={{ color: iconColors[n.icon] || '#64748b' }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${n.read ? 'text-slate-300' : 'text-white font-medium'}`}>{n.message}</p>
                <p className="text-xs text-slate-500 mt-1">{n.time}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {!n.read && <div className="w-2 h-2 rounded-full bg-violet-500" />}
                <button onClick={e => { e.stopPropagation(); markNotificationRead(n.id); }}
                  className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 text-slate-500 hover:text-white hover:bg-white/10 transition-all">
                  <Check size={14} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Notifications;
