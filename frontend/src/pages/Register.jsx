import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAuthStore from '../store/useAuthStore';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();
  const { register, loading, error, clearError } = useAuthStore();

  const onSubmit = async (e) => {
    e.preventDefault();
    clearError();
    const result = await register(form.name, form.email, form.password);
    if (result.success) navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8" style={{ background: 'var(--bg-app)', fontFamily: "'Inter', sans-serif" }}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-white text-xl" style={{ background: 'linear-gradient(135deg,var(--primary),#3b82f6)' }}>T</div>
          <span className="font-bold text-2xl text-white">TaskFlow</span>
        </div>
        <h2 className="text-3xl font-black text-white mb-2">Create your account</h2>
        <p className="text-slate-400 mb-8">Start managing your team's work for free</p>

        {error && (
          <div className="rounded-xl p-3 mb-4 text-sm text-red-300" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
            ⚠ {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          {[
            { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Alex Johnson' },
            { label: 'Work Email', key: 'email', type: 'email', placeholder: 'name@company.com' },
            { label: 'Password', key: 'password', type: 'password', placeholder: 'Min. 6 characters' },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">{f.label}</label>
              <input value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} type={f.type} required placeholder={f.placeholder}
                className="w-full px-4 py-3 rounded-xl text-white placeholder-slate-500 outline-none text-sm"
                style={{ background: 'var(--bg-input)', border: '1px solid var(--border-medium)' }} />
            </div>
          ))}
          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2"
            style={{ background: loading ? 'rgba(var(--primary-rgb),0.5)' : 'linear-gradient(135deg,var(--primary),#3b82f6)', boxShadow: '0 8px 32px rgba(var(--primary-rgb),0.4)' }}>
            {loading ? (<><div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />Creating account...</>) : 'Create Free Account →'}
          </button>
        </form>
        <p className="text-xs text-slate-500 text-center mt-4">By signing up, you agree to our Terms of Service and Privacy Policy</p>
        <p className="text-center text-sm text-slate-400 mt-4">
          Already have an account? <Link to="/login" className="text-violet-400 hover:text-violet-300 font-medium">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
