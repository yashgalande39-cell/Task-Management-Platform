import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { getConnectionStatus } from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'taskflow_super_secret_jwt_key_2026_production_grade';

// Demo users mirror (must match auth.controller.js)
const DEMO_USERS = [
  { _id: 'demo_001', name: 'Alex Johnson', email: 'admin@taskflow.io', role: 'Admin', department: 'Engineering', bio: '', avatar: '' },
  { _id: 'demo_002', name: 'Sarah Chen', email: 'sarah@taskflow.io', role: 'Manager', department: 'Design', bio: '', avatar: '' },
  { _id: 'demo_003', name: 'Marcus Williams', email: 'marcus@taskflow.io', role: 'Team Lead', department: 'Engineering', bio: '', avatar: '' },
];

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);

      // Demo mode — resolve user from in-memory store
      if (!getConnectionStatus()) {
        const demoUser = DEMO_USERS.find(u => u._id === decoded.id);
        if (demoUser) {
          req.user = demoUser;
          return next();
        }
        return res.status(401).json({ message: 'Not authorized' });
      }

      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) return res.status(401).json({ message: 'User not found' });
      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};
