import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { getConnectionStatus } from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'taskflow_super_secret_jwt_key_2026_production_grade';

const generateToken = (id) => jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });

// ── DEMO users for when MongoDB is not connected ────────────────────
const DEMO_USERS = [
  { _id: 'demo_001', name: 'Alex Johnson', email: 'admin@taskflow.io', password: 'password123', role: 'Admin', department: 'Engineering', bio: 'Building world-class software 🚀', avatar: '' },
  { _id: 'demo_002', name: 'Sarah Chen', email: 'sarah@taskflow.io', password: 'password123', role: 'Manager', department: 'Design', bio: 'UX & Product design enthusiast', avatar: '' },
  { _id: 'demo_003', name: 'Marcus Williams', email: 'marcus@taskflow.io', password: 'password123', role: 'Team Lead', department: 'Engineering', bio: 'Full-stack developer', avatar: '' },
];

// ── Register ─────────────────────────────────────────────────────────
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  // Demo mode (no MongoDB)
  if (!getConnectionStatus()) {
    const existing = DEMO_USERS.find(u => u.email === email);
    if (existing) return res.status(400).json({ message: 'Email already in use (demo mode)' });
    const demoUser = { _id: `demo_${Date.now()}`, name, email, password, role: 'Admin', department: '', bio: '', avatar: '' };
    DEMO_USERS.push(demoUser);
    return res.status(201).json({
      _id: demoUser._id, name: demoUser.name, email: demoUser.email, role: demoUser.role,
      department: demoUser.department, bio: demoUser.bio, avatar: demoUser.avatar,
      token: generateToken(demoUser._id),
    });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });
    const user = await User.create({ name, email, password });
    if (user) {
      res.status(201).json({ _id: user._id, name: user.name, email: user.email, role: user.role, department: user.department || '', bio: user.bio || '', avatar: user.avatar, token: generateToken(user._id) });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Login ─────────────────────────────────────────────────────────────
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Demo mode (no MongoDB)
  if (!getConnectionStatus()) {
    const demoUser = DEMO_USERS.find(u => u.email === email);
    if (demoUser && password === demoUser.password) {
      return res.json({
        _id: demoUser._id, name: demoUser.name, email: demoUser.email, role: demoUser.role,
        department: demoUser.department, bio: demoUser.bio, avatar: demoUser.avatar,
        token: generateToken(demoUser._id),
        _demoMode: true,
      });
    }
    return res.status(401).json({ message: 'Invalid email or password. Try admin@taskflow.io / password123' });
  }

  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, department: user.department || '', bio: user.bio || '', avatar: user.avatar, token: generateToken(user._id) });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Get Me ────────────────────────────────────────────────────────────
export const getMe = async (req, res) => {
  // Demo mode
  if (!getConnectionStatus()) {
    const demoUser = DEMO_USERS.find(u => u._id === req.user._id || u._id === String(req.user._id));
    if (demoUser) {
      return res.json({ _id: demoUser._id, name: demoUser.name, email: demoUser.email, role: demoUser.role, department: demoUser.department, bio: demoUser.bio, avatar: demoUser.avatar });
    }
  }
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
