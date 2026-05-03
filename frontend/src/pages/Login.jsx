import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAuthStore from '../store/useAuthStore';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const navigate = useNavigate();
  const { login, loading, error, clearError } = useAuthStore();

  const onSubmit = async (e) => {
    e.preventDefault();
    clearError();
    const result = await login(email, password);
    if (result.success) navigate('/');
  };

  const fillDemo = () => { setEmail('admin@taskflow.io'); setPassword('password123'); };

  const features = ['Multi-project management', 'Real-time collaboration', 'Advanced analytics', 'Board & Calendar views'];

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-app)', fontFamily: "'Inter', sans-serif" }}>
      {/* Left Panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1a1040 0%, #0f1528 50%, #0a1628 100%)' }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-80 h-80 rounded-full opacity-20 blur-3xl" style={{ background: 'radial-gradient(circle, var(--primary), transparent)' }} />
          <div className="absolute -bottom-40 -right-20 w-96 h-96 rounded-full opacity-20 blur-3xl" style={{ background: 'radial-gradient(circle, #3b82f6, transparent)' }} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-white text-xl" style={{ background: 'linear-gradient(135deg,var(--primary),#3b82f6)' }}>T</div>
            <span className="font-bold text-2xl text-white tracking-tight">TaskFlow</span>
          </div>
          <h1 className="text-4xl font-black text-white leading-tight mb-4">Manage work<br />like a pro team</h1>
          <p className="text-slate-400 text-lg mb-10">The all-in-one platform for high-performing teams to plan, track, and deliver work faster.</p>
          <div className="space-y-3">
            {features.map((f, i) => (
              <motion.div key={f} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.1 }} className="flex items-center gap-3 text-slate-300">
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(var(--primary-rgb),0.3)', border: '1px solid rgba(var(--primary-rgb),0.5)' }}>
                  <svg className="w-3 h-3 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                </div>
                {f}
              </motion.div>
            ))}
          </div>
        </div>
        <div className="relative z-10">
          <div className="flex -space-x-2 mb-3">
            {[1, 2, 3, 4, 5].map(i => <img key={i} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}`} className="w-8 h-8 rounded-full border-2 bg-slate-700" style={{ borderColor: '#1a1040' }} alt="" />)}
          </div>
          <p className="text-slate-400 text-sm"><span className="text-white font-semibold">10,000+</span> teams ship faster with TaskFlow</p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-white text-xl" style={{ background: 'linear-gradient(135deg,var(--primary),#3b82f6)' }}>T</div>
            <span className="font-bold text-2xl text-white">TaskFlow</span>
          </div>
          <h2 className="text-3xl font-black text-white mb-2">Welcome back</h2>
          <p className="text-slate-400 mb-8">Sign in to continue to your workspace</p>

          {/* Demo Credentials Box */}
          <button onClick={fillDemo} className="w-full rounded-xl p-4 mb-6 text-sm text-left transition-all hover:border-violet-400" style={{ background: 'rgba(var(--primary-rgb),0.1)', border: '1px solid rgba(var(--primary-rgb),0.3)' }}>
            <p className="text-violet-300 font-semibold mb-1">✨ Click to fill demo credentials</p>
            <p className="text-slate-400">admin@taskflow.io / password123</p>
          </button>

          {error && (
            <div className="rounded-xl p-3 mb-4 text-sm text-red-300" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
              ⚠ {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Email address</label>
              <input value={email} onChange={e => setEmail(e.target.value)} type="email" required placeholder="name@company.com"
                className="w-full px-4 py-3 rounded-xl text-white placeholder-slate-500 outline-none text-sm"
                style={{ background: 'var(--bg-input)', border: '1px solid var(--border-medium)' }} />
            </div>
            <div>
              <div className="flex justify-between mb-1.5">
                <label className="block text-sm font-medium text-slate-300">Password</label>
                <span className="text-xs text-violet-400 cursor-pointer hover:text-violet-300">Forgot password?</span>
              </div>
              <input value={password} onChange={e => setPassword(e.target.value)} type="password" required placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl text-white placeholder-slate-500 outline-none text-sm"
                style={{ background: 'var(--bg-input)', border: '1px solid var(--border-medium)' }} />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="remember" checked={remember} onChange={e => setRemember(e.target.checked)} className="rounded" />
              <label htmlFor="remember" className="text-sm text-slate-400">Remember me for 30 days</label>
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 mt-2"
              style={{ background: loading ? 'rgba(var(--primary-rgb),0.5)' : 'linear-gradient(135deg,var(--primary),#3b82f6)', boxShadow: loading ? 'none' : '0 8px 32px rgba(var(--primary-rgb),0.4)' }}>
              {loading ? (<><div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />Signing in...</>) : 'Sign In →'}
            </button>
          </form>
          <p className="text-center text-sm text-slate-400 mt-6">
            Don't have an account? <Link to="/register" className="text-violet-400 hover:text-violet-300 font-medium">Create one free</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
