import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTasks, useUpdateTask } from '../hooks/useTasks';
import { useProjects } from '../hooks/useProjects';
import { getSocket, joinProjectRoom, leaveProjectRoom, emitTaskMove } from '../lib/socket';
import useAuthStore from '../store/useAuthStore';
import useUIStore from '../store/useUIStore';
import { useQueryClient } from '@tanstack/react-query';

const COLUMNS = [
  { id: 'Backlog', label: 'Backlog', color: '#64748b' },
  { id: 'Todo', label: 'To Do', color: '#3b82f6' },
  { id: 'In Progress', label: 'In Progress', color: '#f59e0b' },
  { id: 'In Review', label: 'In Review', color: '#a855f7' },
  { id: 'Completed', label: 'Completed', color: '#22c55e' },
];
const priorityColors = { Low: '#22c55e', Medium: '#f59e0b', High: '#ef4444', Urgent: '#dc2626' };

const TaskCard = ({ task }) => {
  const [dragging, setDragging] = useState(false);
  const assigneeUrl = task.assignee?.avatar ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(task.assignee?.name || 'User')}`;

  return (
    <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      draggable
      onDragStart={(e) => { e.dataTransfer.setData('taskId', task._id || task.id); setDragging(true); }}
      onDragEnd={() => setDragging(false)}
      className="rounded-xl p-4 cursor-grab active:cursor-grabbing"
      style={{ background: 'var(--bg-card-hover)', border: '1px solid var(--border-light)', opacity: dragging ? 0.5 : 1 }}>
      <p className="text-sm font-semibold text-white leading-snug mb-3">{task.title}</p>
      {task.description && <p className="text-xs text-slate-400 mb-3 line-clamp-2">{task.description}</p>}
      <div className="flex flex-wrap gap-1 mb-3">
        {task.labels?.map(l => <span key={l} className="text-xs px-1.5 py-0.5 rounded text-slate-400" style={{ background: 'rgba(255,255,255,0.07)' }}>{l}</span>)}
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: `${priorityColors[task.priority]}20`, color: priorityColors[task.priority] }}>
          {task.priority}
        </span>
        <div className="flex items-center gap-2">
          {task.dueDate && <span className="text-xs text-slate-500">{new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>}
          {task.assignee && <img src={assigneeUrl} className="w-6 h-6 rounded-full" alt="" style={{ background: '#1e2332' }} />}
        </div>
      </div>
    </motion.div>
  );
};

const Column = ({ column, tasks, onMoveTask }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  return (
    <div className="flex flex-col min-w-72 max-w-72 rounded-2xl"
      style={{ background: 'var(--bg-app)', border: `1px solid ${isDragOver ? column.color : 'var(--border-light)'}`, transition: 'border-color 0.2s' }}
      onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={e => { e.preventDefault(); setIsDragOver(false); onMoveTask(e.dataTransfer.getData('taskId'), column.id); }}>
      <div className="flex items-center gap-2 p-4 flex-shrink-0">
        <div className="w-2.5 h-2.5 rounded-full" style={{ background: column.color }} />
        <span className="text-sm font-bold text-white">{column.label}</span>
        <span className="text-xs px-2 py-0.5 rounded-full font-bold text-slate-400 ml-auto" style={{ background: 'var(--border-light)' }}>{tasks.length}</span>
      </div>
      <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-2 min-h-32">
        {tasks.map(t => <TaskCard key={t._id || t.id} task={t} />)}
        {isDragOver && (
          <div className="rounded-xl h-20 border-2 border-dashed flex items-center justify-center" style={{ borderColor: column.color }}>
            <p className="text-xs font-medium" style={{ color: column.color }}>Drop here</p>
          </div>
        )}
      </div>
    </div>
  );
};

const Board = () => {
  const { data: tasks = [], isLoading } = useTasks();
  const { data: projects = [] } = useProjects();
  const { mutate: updateTask } = useUpdateTask();
  const { user } = useAuthStore();
  const { pushNotification } = useUIStore();
  const qc = useQueryClient();
  const [selectedProject, setSelectedProject] = useState('all');

  // Socket.IO real-time updates
  useEffect(() => {
    const socket = getSocket();

    const handleTaskUpdated = ({ taskId, status, updatedBy }) => {
      // Refresh tasks cache when someone else moves a task
      qc.invalidateQueries({ queryKey: ['tasks'] });
      pushNotification({ message: `${updatedBy} moved a task to "${status}"`, icon: 'status', type: 'status' });
    };

    socket.on('task_updated', handleTaskUpdated);
    return () => socket.off('task_updated', handleTaskUpdated);
  }, [qc, pushNotification]);

  // Join/leave project rooms
  useEffect(() => {
    if (selectedProject !== 'all') {
      joinProjectRoom(selectedProject);
      return () => leaveProjectRoom(selectedProject);
    }
  }, [selectedProject]);

  const filtered = selectedProject === 'all' ? tasks : tasks.filter(t => {
    const pid = t.project?._id || t.project;
    return pid === selectedProject;
  });

  const moveTask = (taskId, newStatus) => {
    const task = tasks.find(t => (t._id || t.id) === taskId || t._id === taskId);
    if (!task || task.status === newStatus) return;
    const tid = task._id || task.id;
    updateTask({ id: tid, status: newStatus });
    // Emit to other connected users
    const projectId = task.project?._id || task.project || selectedProject;
    if (projectId && projectId !== 'all') {
      emitTaskMove({ projectId, taskId: tid, newStatus, movedBy: user?.name || 'Someone' });
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex items-center justify-between flex-shrink-0 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-white">Task Board</h1>
          <p className="text-slate-400 mt-1">Drag and drop tasks between columns</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Real-time sync active
          </div>
          <select value={selectedProject} onChange={e => setSelectedProject(e.target.value)}
            className="px-4 py-2.5 rounded-xl text-white text-sm outline-none" style={{ background: 'var(--bg-input)', border: '1px solid var(--border-light)' }}>
            <option value="all">All Projects</option>
            {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><div className="flex gap-1.5">{[0, 150, 300].map(d => <div key={d} className="w-2 h-2 rounded-full bg-violet-500 animate-bounce" style={{ animationDelay: `${d}ms` }} />)}</div></div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-4 flex-1">
          {COLUMNS.map(col => (
            <Column key={col.id} column={col}
              tasks={filtered.filter(t => t.status === col.id)}
              onMoveTask={moveTask} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Board;
