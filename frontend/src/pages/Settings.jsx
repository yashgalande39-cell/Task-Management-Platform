import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Shield, Palette, Save, Camera } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import useUIStore from '../store/useUIStore';
import { useUpdateProfile } from '../hooks/useUsers';

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'appearance', label: 'Appearance', icon: Palette },
];

const Settings = () => {
  const { user } = useAuthStore();
  const { mutate: updateProfile, isPending } = useUpdateProfile();
  const [activeTab, setActiveTab] = useState('profile');
  const [form, setForm] = useState({ name: user?.name || '', bio: user?.bio || '', department: user?.department || '' });

  const notifToggles = [
    { label: 'Task assigned to you', sub: 'Get notified when someone assigns you a task', default: true },
    { label: 'Mentioned in a comment', sub: 'Get notified when someone @mentions you', default: true },
    { label: 'Deadline approaching', sub: 'Reminder 24 hours before task deadline', default: true },
    { label: 'Status changes', sub: 'When a task status you follow changes', default: false },
    { label: 'New team member', sub: 'When someone joins your workspace', default: false },
  ];
  const [toggles, setToggles] = useState(notifToggles.map(n => n.default));

  const handleSave = () => {
    updateProfile(form);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-black text-white">Settings</h1>
        <p className="text-slate-400 mt-1">Manage your account preferences and workspace settings</p>
      </div>

      <div className="flex gap-6">
        <div className="w-52 flex-shrink-0 space-y-1">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{ background: activeTab === tab.id ? 'rgba(124,58,237,0.2)' : 'transparent', color: activeTab === tab.id ? '#a78bfa' : '#64748b', border: activeTab === tab.id ? '1px solid rgba(124,58,237,0.3)' : '1px solid transparent' }}>
              <tab.icon size={16} /> {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 rounded-2xl p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)' }}>
          {activeTab === 'profile' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
              <h2 className="text-white font-bold text-lg">Profile Settings</h2>
              <div className="flex items-center gap-5">
                <div className="relative">
                  <img src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user?.name || 'user')}`}
                    className="w-20 h-20 rounded-2xl object-cover" alt="" style={{ background: '#1e2332' }} />
                  <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#7c3aed' }}>
                    <Camera size={14} className="text-white" />
                  </button>
                </div>
                <div>
                  <p className="text-white font-semibold">{user?.name}</p>
                  <p className="text-slate-400 text-sm">{user?.email}</p>
                  <p className="text-xs text-violet-400 mt-1">{user?.role}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-400 mb-1.5 block">Full Name</label>
                  <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none" style={{ background: 'var(--bg-input)', border: '1px solid var(--border-medium)' }} />
                </div>
                <div>
                  <label className="text-sm text-slate-400 mb-1.5 block">Department</label>
                  <input value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} placeholder="e.g. Engineering"
                    className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none" style={{ background: 'var(--bg-input)', border: '1px solid var(--border-medium)' }} />
                </div>
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-1.5 block">Bio</label>
                <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} rows={3} placeholder="Tell your team about yourself..."
                  className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none resize-none" style={{ background: 'var(--bg-input)', border: '1px solid var(--border-medium)' }} />
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-1.5 block">Email Address</label>
                <input value={user?.email} readOnly className="w-full px-4 py-2.5 rounded-xl text-slate-400 text-sm outline-none cursor-not-allowed"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-light)' }} />
              </div>
              <button onClick={handleSave} disabled={isPending} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#3b82f6)' }}>
                {isPending ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</> : <><Save size={16} />Save Changes</>}
              </button>
            </motion.div>
          )}

          {activeTab === 'notifications' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <h2 className="text-white font-bold text-lg">Notification Preferences</h2>
              {notifToggles.map((n, i) => (
                <div key={n.label} className="flex items-center justify-between py-4" style={{ borderBottom: '1px solid var(--bg-input)' }}>
                  <div>
                    <p className="text-white text-sm font-medium">{n.label}</p>
                    <p className="text-slate-400 text-xs mt-0.5">{n.sub}</p>
                  </div>
                  <button onClick={() => setToggles(t => { const c = [...t]; c[i] = !c[i]; return c; })}
                    className="relative w-11 h-6 rounded-full transition-colors flex-shrink-0" style={{ background: toggles[i] ? '#7c3aed' : 'var(--border-medium)' }}>
                    <div className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all shadow-sm" style={{ left: toggles[i] ? 'calc(100% - 22px)' : '2px' }} />
                  </button>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'security' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
              <h2 className="text-white font-bold text-lg">Security Settings</h2>
              <div className="p-4 rounded-xl" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' }}>
                <p className="text-emerald-400 text-sm font-semibold">✓ Account is secure</p>
                <p className="text-slate-400 text-xs mt-1">Your account has all recommended security features enabled.</p>
              </div>
              <div className="space-y-4">
                {[{ l: 'Current Password' }, { l: 'New Password' }, { l: 'Confirm Password' }].map(f => (
                  <div key={f.l}>
                    <label className="text-sm text-slate-400 mb-1.5 block">{f.l}</label>
                    <input type="password" placeholder="••••••••"
                      className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none" style={{ background: 'var(--bg-input)', border: '1px solid var(--border-medium)' }} />
                  </div>
                ))}
                <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: 'linear-gradient(135deg,#7c3aed,#3b82f6)' }}>Update Password</button>
              </div>
              <div className="pt-4" style={{ borderTop: '1px solid var(--border-light)' }}>
                <h3 className="text-white font-bold mb-3">Two-Factor Authentication</h3>
                <p className="text-slate-400 text-sm mb-3">Add an extra layer of security to your account</p>
                <button className="px-4 py-2 rounded-xl text-sm font-medium text-white" style={{ border: '1px solid rgba(124,58,237,0.4)', background: 'rgba(124,58,237,0.1)' }}>Enable 2FA</button>
              </div>
            </motion.div>
          )}

          {activeTab === 'appearance' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
              <h2 className="text-white font-bold text-lg">Appearance</h2>
              <div>
                <label className="text-sm text-slate-400 mb-3 block">Theme</label>
                <div className="grid grid-cols-2 gap-3">
                  {['Dark', 'Light'].map(t => (
                    <button key={t} onClick={() => useUIStore.getState().setTheme(t)} className="p-4 rounded-xl text-sm font-medium text-center transition-all"
                      style={{ background: useUIStore.getState().theme === t ? 'rgba(var(--primary-rgb), 0.2)' : 'var(--bg-input)', border: useUIStore.getState().theme === t ? '1px solid rgba(var(--primary-rgb), 0.5)' : '1px solid var(--border-light)', color: useUIStore.getState().theme === t ? 'var(--primary)' : '#64748b' }}>
                      {t === 'Dark' ? '🌙' : '☀️'} {t} Mode {useUIStore.getState().theme === t && '(Active)'}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-3 block">Accent Color</label>
                <div className="flex gap-3">
                  {['#7c3aed', '#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#ec4899'].map(c => (
                    <button key={c} onClick={() => useUIStore.getState().setAccentColor(c)} className="w-8 h-8 rounded-lg transition-transform hover:scale-110" style={{ background: c, outline: useUIStore.getState().accentColor === c ? `2px solid ${c}` : '2px solid transparent', outlineOffset: '2px' }} />
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-3 block">Language</label>
                <select value={useUIStore.getState().language} onChange={e => useUIStore.getState().setLanguage(e.target.value)} className="px-4 py-2.5 rounded-xl text-white text-sm outline-none" style={{ background: 'var(--bg-input)', border: '1px solid var(--border-medium)' }}>
                  <option value="English (US)">English (US)</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                </select>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
