import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Clock, Users, CheckSquare, BarChart2, Edit } from 'lucide-react';
import useAppStore from '../store/useAppStore';

const ProjectDetail = () => {
  const { id } = useParams();
  const { projects, tasks } = useAppStore();
  const project = projects.find(p => p.id === Number(id));
  const projectTasks = tasks.filter(t => t.project === Number(id));
  const [activeTab, setActiveTab] = useState('overview');

  if (!project) return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <h2 className="text-white text-2xl font-bold mb-2">Project not found</h2>
      <Link to="/projects" className="text-violet-400 flex items-center gap-1 mt-2"><ArrowLeft size={16}/>Back to Projects</Link>
    </div>
  );

  const statusColors = { 'Backlog': '#64748b', 'Todo': '#3b82f6', 'In Progress': '#f59e0b', 'In Review': '#a855f7', 'Testing': '#06b6d4', 'Completed': '#22c55e', 'Blocked': '#ef4444' };
  const tabs = ['overview','tasks','team'];

  const statusGroups = {};
  projectTasks.forEach(t => { if (!statusGroups[t.status]) statusGroups[t.status] = []; statusGroups[t.status].push(t); });

  return (
    <div className="space-y-6 max-w-screen-xl">
      {/* Header */}
      <div>
        <Link to="/projects" className="flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-4 transition-colors w-fit">
          <ArrowLeft size={16}/> Back to Projects
        </Link>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-xl" style={{background:`${project.color}30`, border:`1px solid ${project.color}50`}}>
              {project.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">{project.name}</h1>
              <p className="text-slate-400 text-sm mt-0.5">{project.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm px-3 py-1.5 rounded-full font-medium" style={{background:`${project.color}20`, color:project.color, border:`1px solid ${project.color}40`}}>{project.status}</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Tasks', value: projectTasks.length, icon: CheckSquare, color: 'var(--primary)' },
          { label: 'Completed', value: projectTasks.filter(t => t.status === 'Completed').length, icon: CheckSquare, color: '#22c55e' },
          { label: 'Progress', value: `${project.progress}%`, icon: BarChart2, color: '#3b82f6' },
          { label: 'Team Size', value: project.team.length, icon: Users, color: '#f59e0b' },
        ].map(stat => (
          <div key={stat.label} className="rounded-2xl p-4" style={{background:'var(--bg-card)', border:'1px solid var(--border-light)'}}>
            <div className="flex items-center gap-2 mb-2">
              <stat.icon size={16} style={{color: stat.color}} />
              <span className="text-xs text-slate-400">{stat.label}</span>
            </div>
            <p className="text-2xl font-black text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="rounded-2xl p-5" style={{background:'var(--bg-card)', border:'1px solid var(--border-light)'}}>
        <div className="flex justify-between mb-2">
          <span className="text-sm text-slate-400">Overall Progress</span>
          <span className="text-sm font-bold text-white">{project.progress}%</span>
        </div>
        <div className="h-3 rounded-full overflow-hidden" style={{background:'var(--border-light)'}}>
          <motion.div className="h-full rounded-full" initial={{width:0}} animate={{width:`${project.progress}%`}} transition={{duration:1, ease:'easeOut'}} style={{background:`linear-gradient(90deg, ${project.color}, ${project.color}bb)`}} />
        </div>
        <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
          <Clock size={12}/> Due {new Date(project.dueDate).toLocaleDateString('en-US', {weekday:'long', year:'numeric', month:'long', day:'numeric'})}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl w-fit" style={{background:'var(--bg-input)'}}>
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className="px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all" style={{background: activeTab === tab ? 'var(--bg-card)' : 'transparent', color: activeTab === tab ? 'white' : '#64748b', boxShadow: activeTab === tab ? '0 1px 4px rgba(0,0,0,0.4)' : 'none'}}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl p-5" style={{background:'var(--bg-card)', border:'1px solid var(--border-light)'}}>
            <h3 className="text-white font-bold mb-4">Task Breakdown</h3>
            <div className="space-y-3">
              {Object.entries(statusGroups).map(([status, tasks]) => (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{background: statusColors[status]}}/>
                    <span className="text-sm text-slate-300">{status}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-1.5 rounded-full" style={{background:'var(--border-light)'}}>
                      <div className="h-full rounded-full" style={{width: `${(tasks.length / projectTasks.length) * 100}%`, background: statusColors[status]}}/>
                    </div>
                    <span className="text-sm text-slate-400 w-4 text-right">{tasks.length}</span>
                  </div>
                </div>
              ))}
              {projectTasks.length === 0 && <p className="text-slate-500 text-sm">No tasks yet</p>}
            </div>
          </div>
          <div className="rounded-2xl p-5" style={{background:'var(--bg-card)', border:'1px solid var(--border-light)'}}>
            <h3 className="text-white font-bold mb-4">Project Info</h3>
            <div className="space-y-3 text-sm">
              {[
                { label: 'Priority', value: project.priority },
                { label: 'Tags', value: project.tags?.join(', ') || 'None' },
                { label: 'Deadline', value: new Date(project.dueDate).toLocaleDateString('en-US', {month:'long', day:'numeric', year:'numeric'}) },
                { label: 'Tasks', value: `${project.completedTasks} / ${project.tasks} completed` },
              ].map(item => (
                <div key={item.label} className="flex justify-between py-2" style={{borderBottom:'1px solid var(--bg-input)'}}>
                  <span className="text-slate-400">{item.label}</span>
                  <span className="text-white font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'tasks' && (
        <div className="rounded-2xl p-5" style={{background:'var(--bg-card)', border:'1px solid var(--border-light)'}}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white font-bold">Tasks ({projectTasks.length})</h3>
            <Link to="/tasks" className="flex items-center gap-1.5 text-sm text-violet-400 hover:text-violet-300"><Plus size={14}/>Add Task</Link>
          </div>
          {projectTasks.length === 0 ? <p className="text-slate-500 text-center py-8">No tasks for this project yet.</p> : (
            <div className="space-y-2">
              {projectTasks.map(task => (
                <div key={task.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors" style={{border:'1px solid rgba(255,255,255,0.04)'}}>
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{background: statusColors[task.status]}}/>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium truncate">{task.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">Due {task.dueDate}</p>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{background: statusColors[task.status]+'20', color: statusColors[task.status]}}>{task.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'team' && (
        <div className="rounded-2xl p-5" style={{background:'var(--bg-card)', border:'1px solid var(--border-light)'}}>
          <h3 className="text-white font-bold mb-4">Team Members</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {project.team.map(memberId => {
              const member = { 1: 'Alex Johnson', 2: 'Sarah Chen', 3: 'Marcus Williams', 4: 'Priya Patel', 5: 'Jordan Lee', 6: 'Emma Rodriguez' }[memberId];
              if (!member) return null;
              const roles = { 1: 'Admin', 2: 'Manager', 3: 'Team Lead', 4: 'Member', 5: 'Member', 6: 'Guest' };
              const seeds = { 1: 'Alex', 2: 'Sarah', 3: 'Marcus', 4: 'Priya', 5: 'Jordan', 6: 'Emma' };
              return (
                <div key={memberId} className="flex items-center gap-3 p-3 rounded-xl" style={{background:'rgba(255,255,255,0.04)'}}>
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${seeds[memberId]}`} className="w-10 h-10 rounded-full" alt="" style={{background:'#1e2332'}} />
                  <div>
                    <p className="text-white text-sm font-semibold">{member}</p>
                    <p className="text-slate-400 text-xs">{roles[memberId]}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;
