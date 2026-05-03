import React from 'react';
import { motion } from 'framer-motion';
import { Search, Mail, Plus } from 'lucide-react';
import { useState } from 'react';
import { useUsers } from '../hooks/useUsers';

const roleColors = { 'Admin': 'var(--primary)', 'Manager': '#3b82f6', 'Team Lead': '#f59e0b', 'Member': '#22c55e', 'Guest': '#64748b' };
const statusColors = { online: '#22c55e', away: '#f59e0b', offline: '#64748b' };

const Team = () => {
  const { data: members = [], isLoading } = useUsers();
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('All');

  const filtered = members.filter(m => {
    const ms = m.name.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase());
    const fr = filterRole === 'All' || m.role === filterRole;
    return ms && fr;
  });

  return (
    <div className="space-y-6 max-w-screen-xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Team</h1>
          <p className="text-slate-400 mt-1">{members.length} members in your workspace</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ background: 'linear-gradient(135deg,var(--primary),#3b82f6)', boxShadow: '0 4px 20px rgba(var(--primary-rgb),0.4)' }}>
          <Plus size={16} /> Invite Member
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search members..."
            className="pl-9 pr-4 py-2.5 rounded-xl text-white text-sm outline-none w-64" style={{ background: 'var(--bg-input)', border: '1px solid var(--border-light)' }} />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['All', 'Admin', 'Manager', 'Team Lead', 'Member', 'Guest'].map(r => (
            <button key={r} onClick={() => setFilterRole(r)} className="px-3 py-2 rounded-xl text-sm font-medium transition-all"
              style={{ background: filterRole === r ? 'linear-gradient(135deg,var(--primary),#3b82f6)' : 'var(--bg-input)', color: filterRole === r ? 'white' : '#94a3b8', border: filterRole === r ? 'none' : '1px solid var(--border-light)' }}>
              {r}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><div className="flex gap-1.5">{[0, 150, 300].map(d => <div key={d} className="w-2 h-2 rounded-full bg-violet-500 animate-bounce" style={{ animationDelay: `${d}ms` }} />)}</div></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((member, i) => {
            const avatarUrl = member.avatarUrl || member.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(member.name)}`;
            return (
              <motion.div key={member._id || member.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="rounded-2xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)' }}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img src={avatarUrl} className="w-12 h-12 rounded-2xl object-cover" alt="" style={{ background: '#1e2332' }} />
                      <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2" style={{ background: statusColors[member.status || 'offline'], borderColor: 'var(--bg-card)' }} />
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">{member.name}</p>
                      <p className="text-slate-400 text-xs mt-0.5">{member.department || 'Team Member'}</p>
                    </div>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{ background: `${roleColors[member.role] || '#64748b'}20`, color: roleColors[member.role] || '#94a3b8' }}>
                    {member.role}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-4">
                  <Mail size={12} /> {member.email}
                </div>
                <div className="grid grid-cols-2 gap-3 pt-4" style={{ borderTop: '1px solid var(--border-light)' }}>
                  <div className="text-center">
                    <p className="text-xl font-black text-white">{member.tasksCompleted || 0}</p>
                    <p className="text-xs text-slate-500 mt-0.5">Tasks Done</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-black text-white">{member.projects || 0}</p>
                    <p className="text-xs text-slate-500 mt-0.5">Projects</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button className="flex-1 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white transition-colors" style={{ border: '1px solid var(--border-light)' }}>Message</button>
                  <button className="flex-1 py-2 rounded-xl text-sm font-medium text-white" style={{ background: 'rgba(var(--primary-rgb),0.2)', border: '1px solid rgba(var(--primary-rgb),0.4)' }}>Profile</button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Team;
