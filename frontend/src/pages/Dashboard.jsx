import React from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CheckCircle2, Clock, AlertCircle, TrendingUp, Plus, ArrowRight, Zap, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { useProjects } from '../hooks/useProjects';
import { useTasks } from '../hooks/useTasks';
import { useAnalytics } from '../hooks/useUsers';

const chartData = [
  { name: 'Mon', completed: 4, pending: 2 },
  { name: 'Tue', completed: 7, pending: 3 },
  { name: 'Wed', completed: 5, pending: 4 },
  { name: 'Thu', completed: 9, pending: 1 },
  { name: 'Fri', completed: 6, pending: 5 },
  { name: 'Sat', completed: 3, pending: 1 },
  { name: 'Sun', completed: 8, pending: 2 },
];

const Loader = () => (
  <div className="flex items-center justify-center py-16">
    <div className="flex gap-1.5">
      {[0, 150, 300].map(d => <div key={d} className="w-2 h-2 rounded-full bg-violet-500 animate-bounce" style={{ animationDelay: `${d}ms` }} />)}
    </div>
  </div>
);

const StatCard = ({ title, value, icon: Icon, trend, color, bg, loading }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
    className="rounded-2xl p-6 flex flex-col gap-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)' }}>
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm text-slate-400 mb-1">{title}</p>
        <h3 className="text-3xl font-black text-white">{loading ? '—' : value}</h3>
      </div>
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: bg }}>
        <Icon size={22} style={{ color }} />
      </div>
    </div>
    <div className="flex items-center gap-1.5 text-sm">
      <TrendingUp size={14} className="text-emerald-400" />
      <span className="text-emerald-400 font-semibold">{trend}</span>
      <span className="text-slate-500">vs last week</span>
    </div>
  </motion.div>
);

const priorityColors = { Low: '#22c55e', Medium: '#f59e0b', High: '#ef4444', Urgent: '#dc2626' };
const statusColors = { Backlog: '#64748b', Todo: '#3b82f6', 'In Progress': '#f59e0b', 'In Review': '#a855f7', Testing: '#06b6d4', Completed: '#22c55e', Blocked: '#ef4444' };

const Dashboard = () => {
  const { user } = useAuthStore();
  const { data: projects = [], isLoading: projLoading } = useProjects();
  const { data: tasks = [], isLoading: taskLoading } = useTasks();
  const { data: analytics } = useAnalytics();

  const completedTasks = analytics?.completedTasks ?? tasks.filter(t => t.status === 'Completed').length;
  const inProgressTasks = analytics?.inProgress ?? tasks.filter(t => t.status === 'In Progress').length;
  const overdueTasks = analytics?.overdue ?? 0;
  const activeProjects = projects.filter(p => p.status !== 'Completed' && p.status !== 'Archived');
  const recentTasks = tasks.slice(0, 5);
  const greeting = new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-6 max-w-screen-xl">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">{greeting}, {user?.name?.split(' ')[0]} 👋</h1>
          <p className="text-slate-400 mt-1">Here's an overview of your workspace today.</p>
        </div>
        <Link to="/tasks" className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ background: 'linear-gradient(135deg,var(--primary),#3b82f6)', boxShadow: '0 4px 20px rgba(var(--primary-rgb),0.4)' }}>
          <Plus size={16} /> New Task
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Active Projects" value={activeProjects.length} icon={CheckCircle2} trend="+2 this month" color="var(--primary)" bg="rgba(var(--primary-rgb),0.15)" loading={projLoading} />
        <StatCard title="Tasks Completed" value={completedTasks} icon={CheckCircle2} trend="+12%" color="#22c55e" bg="rgba(34,197,94,0.15)" loading={taskLoading} />
        <StatCard title="In Progress" value={inProgressTasks} icon={Clock} trend="+5%" color="#f59e0b" bg="rgba(245,158,11,0.15)" loading={taskLoading} />
        <StatCard title="Overdue" value={overdueTasks} icon={AlertCircle} trend="-2 tasks" color="#ef4444" bg="rgba(239,68,68,0.15)" loading={taskLoading} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="xl:col-span-2 rounded-2xl p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)' }}>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-white font-bold text-lg">Weekly Progress</h3>
              <p className="text-slate-400 text-sm">Task completion over the past 7 days</p>
            </div>
            <div className="flex gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5"><span className="w-3 h-1.5 rounded-full inline-block" style={{ background: 'var(--primary)' }} />Completed</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-1.5 rounded-full inline-block" style={{ background: '#3b82f6' }} />Pending</span>
            </div>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} /><stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="grad2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} /><stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--bg-input)" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#1e2435', border: '1px solid var(--border-medium)', borderRadius: '12px', color: '#e2e8f0' }} />
                <Area type="monotone" dataKey="completed" stroke="var(--primary)" strokeWidth={2} fill="url(#grad1)" />
                <Area type="monotone" dataKey="pending" stroke="#3b82f6" strokeWidth={2} fill="url(#grad2)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="rounded-2xl p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)' }}>
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-white font-bold text-lg">Recent Tasks</h3>
            <Link to="/tasks" className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1">View all <ArrowRight size={12} /></Link>
          </div>
          {taskLoading ? <Loader /> : (
            <div className="space-y-3">
              {recentTasks.map(task => (
                <div key={task._id || task.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors">
                  <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: statusColors[task.status] || '#64748b' }} />
                  <div className="min-w-0">
                    <p className="text-sm text-white font-medium truncate">{task.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{task.projectName || task.project?.name}</p>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0 font-medium" style={{ background: `${priorityColors[task.priority]}20`, color: priorityColors[task.priority] }}>
                    {task.priority}
                  </span>
                </div>
              ))}
              {recentTasks.length === 0 && <p className="text-slate-500 text-sm text-center py-4">No tasks yet</p>}
            </div>
          )}
        </motion.div>
      </div>

      {/* Active Projects */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="rounded-2xl p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)' }}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-white font-bold text-lg">Active Projects</h3>
          <Link to="/projects" className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1">View all <ArrowRight size={12} /></Link>
        </div>
        {projLoading ? <Loader /> : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {activeProjects.slice(0, 3).map(proj => (
              <Link key={proj._id || proj.id} to={`/projects/${proj._id || proj.id}`} className="p-4 rounded-xl hover:bg-white/5 transition-colors block" style={{ border: '1px solid var(--border-light)' }}>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm" style={{ background: `${proj.color || 'var(--primary)'}30`, border: `1px solid ${proj.color || 'var(--primary)'}50` }}>
                    {proj.name.charAt(0)}
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ background: proj.status === 'Completed' ? 'rgba(34,197,94,0.15)' : proj.status === 'At Risk' ? 'rgba(239,68,68,0.15)' : 'rgba(59,130,246,0.15)', color: proj.status === 'Completed' ? '#22c55e' : proj.status === 'At Risk' ? '#ef4444' : '#60a5fa' }}>
                    {proj.status}
                  </span>
                </div>
                <p className="text-white font-semibold text-sm mb-1 truncate">{proj.name}</p>
                <div className="flex items-center gap-2 mt-3">
                  <div className="flex-1 h-1.5 rounded-full" style={{ background: 'var(--border-medium)' }}>
                    <div className="h-full rounded-full" style={{ width: `${proj.progress || 0}%`, background: proj.color || 'var(--primary)' }} />
                  </div>
                  <span className="text-xs text-slate-400 font-medium">{proj.progress || 0}%</span>
                </div>
              </Link>
            ))}
            {activeProjects.length === 0 && <p className="text-slate-500 text-sm col-span-3">No active projects. <Link to="/projects" className="text-violet-400">Create one →</Link></p>}
          </div>
        )}
      </motion.div>

      {/* AI Insight Panel */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="rounded-2xl p-6 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(var(--primary-rgb),0.15), rgba(59,130,246,0.1))', border: '1px solid rgba(var(--primary-rgb),0.3)' }}>
        <div className="absolute top-0 right-0 w-64 h-64 opacity-10 blur-3xl" style={{ background: 'radial-gradient(circle, var(--primary), transparent)' }} />
        <div className="relative z-10 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(var(--primary-rgb),0.3)' }}>
            <Zap size={20} className="text-violet-300" />
          </div>
          <div>
            <h3 className="text-white font-bold mb-1">AI Productivity Insights</h3>
            <p className="text-slate-300 text-sm">
              {analytics
                ? `You have ${analytics.completionRate}% completion rate this period. ${analytics.overdue > 0 ? `⚠️ ${analytics.overdue} task${analytics.overdue > 1 ? 's are' : ' is'} overdue.` : '✅ No overdue tasks!'} You're managing ${analytics.activeProjects} active project${analytics.activeProjects !== 1 ? 's' : ''}.`
                : 'You\'re most productive on Thursdays. You have 3 high-priority tasks due this week. Consider redistributing tasks from overloaded team members.'}
            </p>
            <Link to="/analytics" className="mt-3 text-sm font-medium text-violet-300 hover:text-violet-200 flex items-center gap-1 w-fit">
              See full analytics <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
