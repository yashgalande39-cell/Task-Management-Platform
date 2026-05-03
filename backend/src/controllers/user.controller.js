import User from '../models/User.js';
import Task from '../models/Task.js';
import Project from '../models/Project.js';
import { getConnectionStatus } from '../config/db.js';

const demoUsers = [
  { _id: 'demo_001', name: 'Alex Johnson', email: 'admin@taskflow.io', role: 'Admin', department: 'Engineering', bio: 'Building world-class software 🚀', avatar: '', isActive: true, tasksCompleted: 3, projects: 4, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex%20Johnson' },
  { _id: 'demo_002', name: 'Sarah Chen', email: 'sarah@taskflow.io', role: 'Manager', department: 'Design', bio: 'UX & Product design enthusiast', avatar: '', isActive: true, tasksCompleted: 5, projects: 3, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah%20Chen' },
  { _id: 'demo_003', name: 'Marcus Williams', email: 'marcus@taskflow.io', role: 'Team Lead', department: 'Engineering', bio: 'Full-stack developer | Open source', avatar: '', isActive: true, tasksCompleted: 7, projects: 2, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus%20Williams' },
  { _id: 'demo_004', name: 'Priya Patel', email: 'priya@taskflow.io', role: 'Member', department: 'Backend', bio: 'Backend & DevOps specialist', avatar: '', isActive: true, tasksCompleted: 4, projects: 2, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya%20Patel' },
  { _id: 'demo_005', name: 'Jordan Lee', email: 'jordan@taskflow.io', role: 'Member', department: 'DevOps', bio: 'Infra & CI/CD pipelines', avatar: '', isActive: true, tasksCompleted: 2, projects: 1, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan%20Lee' },
  { _id: 'demo_006', name: 'Emma Rodriguez', email: 'emma@taskflow.io', role: 'Guest', department: 'QA', bio: 'Quality & testing advocate', avatar: '', isActive: true, tasksCompleted: 1, projects: 2, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma%20Rodriguez' },
];



// @desc  Get all team members (users in same projects)
// @route GET /api/users
// @access Protected
export const getUsers = async (req, res) => {
  if (!getConnectionStatus()) {
    return res.json(demoUsers);
  }
  try {
    const users = await User.find({ isActive: true }).select('-password');
    const usersWithStats = await Promise.all(
      users.map(async (u) => {
        const tasksCompleted = await Task.countDocuments({ assignee: u._id, status: 'Completed' });
        const projectCount = await Project.countDocuments({ members: u._id });
        return {
          ...u.toObject(),
          tasksCompleted,
          projects: projectCount,
          avatarUrl: u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(u.name)}`,
        };
      })
    );
    res.json(usersWithStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Update current user profile
// @route PUT /api/users/me
// @access Protected
export const updateProfile = async (req, res) => {
  if (!getConnectionStatus()) {
    const userIndex = demoUsers.findIndex(u => u._id === String(req.user._id) || u._id === req.user.id);
    if (userIndex !== -1) {
      const { name, bio, department, avatar } = req.body;
      if (name) demoUsers[userIndex].name = name;
      if (bio !== undefined) demoUsers[userIndex].bio = bio;
      if (department !== undefined) demoUsers[userIndex].department = department;
      if (avatar) demoUsers[userIndex].avatar = avatar;
      demoUsers[userIndex].avatarUrl = demoUsers[userIndex].avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(demoUsers[userIndex].name)}`;
      return res.json(demoUsers[userIndex]);
    }
    return res.status(404).json({ message: 'User not found in demo mode' });
  }
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { name, bio, department, avatar } = req.body;
    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (department !== undefined) user.department = department;
    if (avatar) user.avatar = avatar;

    if (req.body.password) {
      user.password = req.body.password; // pre-save hook hashes it
    }

    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      bio: user.bio,
      department: user.department,
      avatar: user.avatar,
      avatarUrl: user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get analytics data
// @route GET /api/users/analytics
// @access Protected
export const getAnalytics = async (req, res) => {
  if (!getConnectionStatus()) {
    return res.json({
      totalTasks: 42,
      completedTasks: 28,
      inProgress: 10,
      overdue: 4,
      completionRate: 66,
      statusDist: [
        { name: 'Todo', value: 4 },
        { name: 'In Progress', value: 10 },
        { name: 'In Review', value: 6 },
        { name: 'Completed', value: 28 },
        { name: 'Blocked', value: 2 }
      ],
      memberPerf: demoUsers.map(u => ({ name: u.name.split(' ')[0], tasks: u.tasksCompleted })),
      activeProjects: 5,
    });
  }
  try {
    const userProjects = await Project.find({
      $or: [{ owner: req.user._id }, { members: req.user._id }],
    }).select('_id');
    const projectIds = userProjects.map((p) => p._id);

    const totalTasks = await Task.countDocuments({ project: { $in: projectIds } });
    const completedTasks = await Task.countDocuments({ project: { $in: projectIds }, status: 'Completed' });
    const inProgress = await Task.countDocuments({ project: { $in: projectIds }, status: 'In Progress' });
    const overdue = await Task.countDocuments({
      project: { $in: projectIds },
      dueDate: { $lt: new Date() },
      status: { $ne: 'Completed' },
    });

    // Status distribution
    const statuses = ['Backlog', 'Todo', 'In Progress', 'In Review', 'Testing', 'Completed', 'Blocked'];
    const statusDist = await Promise.all(
      statuses.map(async (s) => ({
        name: s,
        value: await Task.countDocuments({ project: { $in: projectIds }, status: s }),
      }))
    );

    // Member performance
    const users = await User.find({ isActive: true }).select('name');
    const memberPerf = await Promise.all(
      users.map(async (u) => ({
        name: u.name.split(' ')[0],
        tasks: await Task.countDocuments({ assignee: u._id, status: 'Completed', project: { $in: projectIds } }),
      }))
    );

    res.json({
      totalTasks,
      completedTasks,
      inProgress,
      overdue,
      completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      statusDist: statusDist.filter((s) => s.value > 0),
      memberPerf,
      activeProjects: projectIds.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
