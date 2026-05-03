import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Trash2, CheckSquare, X } from 'lucide-react';
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask } from '../hooks/useTasks';
import { useProjects } from '../hooks/useProjects';

const statusColors = { Backlog: '#64748b', Todo: '#3b82f6', 'In Progress': '#f59e0b', 'In Review': '#a855f7', Testing: '#06b6d4', Completed: '#22c55e', Blocked: '#ef4444' };
const priorityColors = { Low: '#22c55e', Medium: '#f59e0b', High: '#ef4444', Urgent: '#dc2626' };
const ALL_STATUSES = ['Backlog', 'Todo', 'In Progress', 'In Review', 'Testing', 'Completed', 'Blocked'];

const TaskModal = ({ onClose, projects }) => {
  const [form, setForm] = useState({ title: '', description: '', status: 'Todo', priority: 'Medium', dueDate: '', project: projects[0]?._id || '', estimatedHours: 4 });
  const { mutate: createTask, isPending } = useCreateTask();

  const handleSave = () => {
    if (!form.title.trim() || !form.project) return;
    createTask(form, { onSuccess: onClose });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-lg rounded-2xl p-6" style={{ background: 'var(--bg-card-hover)', border: '1px solid var(--border-medium)' }}>
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold text-white">Create Task</h2>
          <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"><X size={18} /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-slate-400 mb-1.5 block">Task Title *</label>
            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="What needs to be done?"
              className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none" style={{ background: 'var(--bg-input)', border: '1px solid var(--border-medium)' }} />
          </div>
          <div>
            <label className="text-sm text-slate-400 mb-1.5 block">Description</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} placeholder="More details..."
              className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none resize-none" style={{ background: 'var(--bg-input)', border: '1px solid var(--border-medium)' }} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-slate-400 mb-1.5 block">Status</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none" style={{ background: 'var(--bg-app)', border: '1px solid var(--border-medium)' }}>
                {ALL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
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
            <div>
              <label className="text-sm text-slate-400 mb-1.5 block">Est. Hours</label>
              <input type="number" value={form.estimatedHours} onChange={e => setForm({ ...form, estimatedHours: Number(e.target.value) })} min={1}
                className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none" style={{ background: 'var(--bg-app)', border: '1px solid var(--border-medium)' }} />
            </div>
          </div>
          <div>
            <label className="text-sm text-slate-400 mb-1.5 block">Project *</label>
            <select value={form.project} onChange={e => setForm({ ...form, project: e.target.value })} className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none" style={{ background: 'var(--bg-app)', border: '1px solid var(--border-medium)' }}>
              {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
            </select>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-medium text-slate-400" style={{ border: '1px solid var(--border-medium)' }}>Cancel</button>
          <button onClick={handleSave} disabled={isPending} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2" style={{ background: 'linear-gradient(135deg,var(--primary),#3b82f6)' }}>
            {isPending ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating...</> : 'Create Task'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const Tasks = () => {
  const { data: tasks = [], isLoading } = useTasks();
  const { data: projects = [] } = useProjects();
  const { mutate: deleteTask } = useDeleteTask();
  const { mutate: updateTask } = useUpdateTask();
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');

  const filtered = tasks.filter(t => {
    const ms = (t.title || '').toLowerCase().includes(search.toLowerCase()) || (t.projectName || '').toLowerCase().includes(search.toLowerCase());
    const fs = filterStatus === 'All' || t.status === filterStatus;
    const fp = filterPriority === 'All' || t.priority === filterPriority;
    return ms && fs && fp;
  });

  const toggleComplete = (task) => {
    const id = task._id || task.id;
    updateTask({ id, status: task.status === 'Completed' ? 'Todo' : 'Completed' });
  };

  return (
    <div className="space-y-6 max-w-screen-xl">
      <AnimatePresence>{showModal && <TaskModal onClose={() => setShowModal(false)} projects={projects} />}</AnimatePresence>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">My Tasks</h1>
          <p className="text-slate-400 mt-1">{filtered.length} tasks</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ background: 'linear-gradient(135deg,var(--primary),#3b82f6)', boxShadow: '0 4px 20px rgba(var(--primary-rgb),0.4)' }}>
          <Plus size={16} /> New Task
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tasks..."
            className="pl-9 pr-4 py-2.5 rounded-xl text-white text-sm outline-none w-64" style={{ background: 'var(--bg-input)', border: '1px solid var(--border-light)' }} />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-4 py-2.5 rounded-xl text-white text-sm outline-none" style={{ background: 'var(--bg-input)', border: '1px solid var(--border-light)' }}>
          <option value="All">All Statuses</option>
          {ALL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)} className="px-4 py-2.5 rounded-xl text-white text-sm outline-none" style={{ background: 'var(--bg-input)', border: '1px solid var(--border-light)' }}>
          <option value="All">All Priorities</option>
          {['Low', 'Medium', 'High', 'Urgent'].map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)' }}>
        <div className="grid text-xs font-semibold text-slate-500 px-5 py-3" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 80px', borderBottom: '1px solid var(--border-light)' }}>
          <span>TASK</span><span>PROJECT</span><span>STATUS</span><span>PRIORITY</span><span>DUE DATE</span><span></span>
        </div>
        {isLoading ? (
          <div className="flex justify-center py-16"><div className="flex gap-1.5">{[0, 150, 300].map(d => <div key={d} className="w-2 h-2 rounded-full bg-violet-500 animate-bounce" style={{ animationDelay: `${d}ms` }} />)}</div></div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <CheckSquare size={40} className="text-slate-700 mb-3" />
            <p className="text-white font-bold">No tasks found</p>
            <p className="text-slate-400 text-sm">Create a new task or adjust your filters</p>
          </div>
        ) : filtered.map((task, i) => {
          const tid = task._id || task.id;
          return (
            <motion.div key={tid} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
              className="grid items-center px-5 py-3.5 hover:bg-white/5 transition-colors group" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 80px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <div className="flex items-center gap-3 min-w-0">
                <button onClick={() => toggleComplete(task)}
                  className="flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors"
                  style={{ borderColor: task.status === 'Completed' ? '#22c55e' : 'rgba(255,255,255,0.2)', background: task.status === 'Completed' ? '#22c55e' : 'transparent' }}>
                  {task.status === 'Completed' && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                </button>
                <span className={`text-sm font-medium truncate ${task.status === 'Completed' ? 'line-through text-slate-500' : 'text-white'}`}>{task.title}</span>
              </div>
              <span className="text-sm text-slate-400 truncate">{task.projectName || task.project?.name}</span>
              <span><span className="text-xs px-2 py-1 rounded-full font-medium" style={{ background: `${statusColors[task.status]}20`, color: statusColors[task.status] }}>{task.status}</span></span>
              <span><span className="text-xs px-2 py-1 rounded-full font-medium" style={{ background: `${priorityColors[task.priority]}20`, color: priorityColors[task.priority] }}>{task.priority}</span></span>
              <span className="text-sm text-slate-400">{task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}</span>
              <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => deleteTask(tid)} className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-colors"><Trash2 size={14} /></button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Tasks;
