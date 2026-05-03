import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useAnalytics } from '../hooks/useUsers';

const weeklyData = [
  { name: 'Mon', completed: 4, inProgress: 3, blocked: 1 },
  { name: 'Tue', completed: 7, inProgress: 5, blocked: 0 },
  { name: 'Wed', completed: 5, inProgress: 4, blocked: 2 },
  { name: 'Thu', completed: 9, inProgress: 2, blocked: 0 },
  { name: 'Fri', completed: 6, inProgress: 5, blocked: 1 },
  { name: 'Sat', completed: 3, inProgress: 1, blocked: 0 },
  { name: 'Sun', completed: 8, inProgress: 3, blocked: 0 },
];
const velocityData = [
  { name: 'Week 1', velocity: 22 }, { name: 'Week 2', velocity: 28 }, { name: 'Week 3', velocity: 19 },
  { name: 'Week 4', velocity: 35 }, { name: 'Week 5', velocity: 30 }, { name: 'Week 6', velocity: 42 },
];
const COLORS = ['var(--primary)', '#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#06b6d4', '#a855f7'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="px-4 py-3 rounded-xl text-sm" style={{ background: '#1e2435', border: '1px solid var(--border-medium)' }}>
        <p className="text-slate-400 mb-1">{label}</p>
        {payload.map((p, i) => <p key={i} style={{ color: p.color }} className="font-semibold">{p.name}: {p.value}</p>)}
      </div>
    );
  }
  return null;
};

const Analytics = () => {
  const { data: analytics, isLoading } = useAnalytics();

  const kpis = [
    { label: 'Completion Rate', value: analytics ? `${analytics.completionRate}%` : '—', sub: 'Tasks completed on time', color: '#22c55e' },
    { label: 'Active Projects', value: analytics ? analytics.activeProjects : '—', sub: 'Projects in progress', color: 'var(--primary)' },
    { label: 'Tasks In Progress', value: analytics ? analytics.inProgress : '—', sub: 'Currently being worked on', color: '#3b82f6' },
    { label: 'Overdue Tasks', value: analytics ? analytics.overdue : '—', sub: 'Past their deadline', color: '#ef4444' },
  ];

  const pieData = analytics?.statusDist || [];
  const memberPerf = analytics?.memberPerf || [];

  return (
    <div className="space-y-6 max-w-screen-xl">
      <div>
        <h1 className="text-2xl font-black text-white">Analytics</h1>
        <p className="text-slate-400 mt-1">Performance insights for your workspace</p>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <motion.div key={kpi.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="rounded-2xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)' }}>
            <p className="text-xs text-slate-400 mb-2">{kpi.label}</p>
            <p className="text-3xl font-black" style={{ color: kpi.color }}>{isLoading ? '...' : kpi.value}</p>
            <p className="text-xs text-slate-500 mt-1">{kpi.sub}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="rounded-2xl p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)' }}>
          <h3 className="text-white font-bold mb-5">Weekly Task Activity</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--bg-input)" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="completed" name="Completed" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="inProgress" name="In Progress" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="blocked" name="Blocked" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="rounded-2xl p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)' }}>
          <h3 className="text-white font-bold mb-5">Task Status Distribution</h3>
          <div className="h-64">
            {pieData.length > 0 ? (
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value">
                    {pieData.map((entry, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#1e2435', border: '1px solid var(--border-medium)', borderRadius: '12px', color: '#e2e8f0' }} />
                  <Legend wrapperStyle={{ color: '#94a3b8', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-500 text-sm">No task data yet</div>
            )}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="rounded-2xl p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)' }}>
          <h3 className="text-white font-bold mb-5">Team Velocity</h3>
          <div className="h-56">
            <ResponsiveContainer>
              <AreaChart data={velocityData}>
                <defs>
                  <linearGradient id="velGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--bg-input)" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="velocity" name="Tasks/week" stroke="var(--primary)" strokeWidth={2} fill="url(#velGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="rounded-2xl p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)' }}>
          <h3 className="text-white font-bold mb-5">Member Performance</h3>
          <div className="h-56">
            {memberPerf.length > 0 ? (
              <ResponsiveContainer>
                <BarChart data={memberPerf} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--bg-input)" horizontal={false} />
                  <XAxis type="number" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis dataKey="name" type="category" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} width={65} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="tasks" name="Tasks Completed" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-500 text-sm">No data yet</div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;
