import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Trash2, Briefcase, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProjects, useCreateProject, useDeleteProject } from '../hooks/useProjects';

const statusStyle = {
  'In Progress': { bg: 'rgba(59,130,246,0.15)', color: '#60a5fa' },
  'At Risk': { bg: 'rgba(239,68,68,0.15)', color: '#f87171' },
  'On Track': { bg: 'rgba(34,197,94,0.15)', color: '#4ade80' },
  'Completed': { bg: 'rgba(100,116,139,0.15)', color: '#94a3b8' },
};
const priorityStyle = {
  Low: { bg: 'rgba(34,197,94,0.15)', color: '#4ade80' },
  Medium: { bg: 'rgba(245,158,11,0.15)', color: '#fbbf24' },
  High: { bg: 'rgba(239,68,68,0.15)', color: '#f87171' },
  Urgent: { bg: 'rgba(220,38,38,0.2)', color: '#ef4444' },
};

const Modal = ({ onClose }) => {
  const [form, setForm] = useState({ name: '', description: '', status: 'In Progress', priority: 'Medium', dueDate: '', color: 'var(--primary)', tags: '' });
  const { mutate: createProject, isPending } = useCreateProject();
  const colors = ['var(--primary)', '#3b82f6', '#22c55e', '#ef4444', '#f59e0b', '#06b6d4', '#a855f7', '#ec4899'];

  const handleSave = () => {
    if (!form.name.trim()) return;
    createProject({
      ...form,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
    }, { onSuccess: onClose });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-lg rounded-2xl p-6" style={{ background: 'var(--bg-card-hover)', border: '1px solid var(--border-medium)' }}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Create New Project</h2>
          <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"><X size={18} /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-slate-400 mb-1.5 block">Project Name *</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Website Redesign"
              className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none" style={{ background: 'var(--bg-input)', border: '1px solid var(--border-medium)' }} />
          </div>
          <div>
            <label className="text-sm text-slate-400 mb-1.5 block">Description</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} placeholder="Brief project description..."
              className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none resize-none" style={{ background: 'var(--bg-input)', border: '1px solid var(--border-medium)' }} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-slate-400 mb-1.5 block">Priority</label>
              <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })} className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none" style={{ background: 'var(--bg-app)', border: '1px solid var(--border-medium)' }}>
                {['Low', 'Medium', 'High', 'Urgent'].map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm text-slate-400 mb-1.5 block">Due Date</label>
              <input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none" style={{ background: 'var(--bg-app)', border: '1px solid var(--border-medium)', colorScheme: 'dark' }} />
            </div>
          </div>
          <div>
            <label className="text-sm text-slate-400 mb-1.5 block">Tags (comma-separated)</label>
            <input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="Design, Frontend, API"
              className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none" style={{ background: 'var(--bg-input)', border: '1px solid var(--border-medium)' }} />
          </div>
          <div>
            <label className="text-sm text-slate-400 mb-2 block">Color</label>
            <div className="flex gap-2 flex-wrap">
              {colors.map(c => (
                <button key={c} onClick={() => setForm({ ...form, color: c })} className="w-8 h-8 rounded-lg transition-all" style={{ background: c, outline: form.color === c ? `2px solid ${c}` : '2px solid transparent', outlineOffset: '2px' }} />
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-medium text-slate-400" style={{ border: '1px solid var(--border-medium)' }}>Cancel</button>
          <button onClick={handleSave} disabled={isPending} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg,var(--primary),#3b82f6)' }}>
            {isPending ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating...</> : 'Create Project'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const Projects = () => {
  const { data: projects = [], isLoading } = useProjects();
  const { mutate: deleteProject } = useDeleteProject();
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const filtered = projects.filter(p => {
    const ms = p.name.toLowerCase().includes(search.toLowerCase());
    const mf = filter === 'All' || p.status === filter;
    return ms && mf;
  });

  return (
    <div className="space-y-6 max-w-screen-xl">
      <AnimatePresence>{showModal && <Modal onClose={() => setShowModal(false)} />}</AnimatePresence>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Projects</h1>
          <p className="text-slate-400 mt-1">{projects.length} total projects</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ background: 'linear-gradient(135deg,var(--primary),#3b82f6)', boxShadow: '0 4px 20px rgba(var(--primary-rgb),0.4)' }}>
          <Plus size={16} /> New Project
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search projects..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-white text-sm outline-none" style={{ background: 'var(--bg-input)', border: '1px solid var(--border-light)' }} />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['All', 'In Progress', 'On Track', 'At Risk', 'Completed'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className="px-3 py-2 rounded-xl text-sm font-medium transition-all"
              style={{ background: filter === f ? 'linear-gradient(135deg,var(--primary),#3b82f6)' : 'var(--bg-input)', color: filter === f ? 'white' : '#94a3b8', border: filter === f ? 'none' : '1px solid var(--border-light)' }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><div className="flex gap-1.5">{[0, 150, 300].map(d => <div key={d} className="w-2 h-2 rounded-full bg-violet-500 animate-bounce" style={{ animationDelay: `${d}ms` }} />)}</div></div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Briefcase size={48} className="text-slate-700 mb-4" />
          <h3 className="text-white font-bold text-lg mb-2">No projects found</h3>
          <p className="text-slate-400 mb-6">Create your first project to get started</p>
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: 'linear-gradient(135deg,var(--primary),#3b82f6)' }}>
            <Plus size={16} /> Create Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((project, i) => {
            const pid = project._id || project.id;
            return (
              <motion.div key={pid} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="rounded-2xl p-5 flex flex-col group" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)' }}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                      style={{ background: `${project.color || 'var(--primary)'}30`, border: `1px solid ${project.color || 'var(--primary)'}50` }}>
                      {project.name.charAt(0)}
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: statusStyle[project.status]?.bg || 'rgba(100,116,139,0.15)', color: statusStyle[project.status]?.color || '#94a3b8' }}>
                      {project.status}
                    </span>
                  </div>
                  <button onClick={() => deleteProject(pid)} className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-colors opacity-0 group-hover:opacity-100">
                    <Trash2 size={14} />
                  </button>
                </div>
                <Link to={`/projects/${pid}`}>
                  <h3 className="text-white font-bold hover:text-violet-300 transition-colors mb-1">{project.name}</h3>
                </Link>
                <p className="text-slate-400 text-sm mb-4 line-clamp-2">{project.description}</p>
                <div className="flex gap-1.5 flex-wrap mb-4">
                  {project.tags?.map(tag => <span key={tag} className="text-xs px-2 py-0.5 rounded-md text-slate-300" style={{ background: 'var(--border-light)' }}>#{tag}</span>)}
                </div>
                <div className="mt-auto space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Progress</span>
                    <span className="text-white font-semibold">{project.progress || 0}%</span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: 'var(--border-light)' }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${project.progress || 0}%`, background: project.color || 'var(--primary)' }} />
                  </div>
                  <div className="flex items-center justify-between pt-2" style={{ borderTop: '1px solid var(--border-light)' }}>
                    <span className="text-xs text-slate-400">{project.dueDate ? new Date(project.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No deadline'}</span>
                    <span className="text-xs text-slate-400">{project.members?.length || 0} members</span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: priorityStyle[project.priority]?.bg || 'rgba(100,116,139,0.15)', color: priorityStyle[project.priority]?.color || '#94a3b8' }}>
                      {project.priority}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Projects;
