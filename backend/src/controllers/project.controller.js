import Project from '../models/Project.js';
import Task from '../models/Task.js';
import { getConnectionStatus } from '../config/db.js';

// ── Demo data for no-DB mode ────────────────────────────────────────
const demoProjects = [
  { _id: 'proj_001', name: 'Marketing Website Redesign', description: 'Complete overhaul of the company website.', owner: { _id: 'demo_001', name: 'Alex Johnson', email: 'admin@taskflow.io' }, members: [{ _id: 'demo_001' }, { _id: 'demo_002' }], status: 'In Progress', priority: 'High', color: '#3b82f6', tags: ['Design', 'Frontend'], dueDate: '2026-06-15', progress: 45, tasks: 6, completedTasks: 2, createdAt: new Date() },
  { _id: 'proj_002', name: 'Q3 Mobile App Release', description: 'Launch the new mobile application.', owner: { _id: 'demo_001', name: 'Alex Johnson', email: 'admin@taskflow.io' }, members: [{ _id: 'demo_001' }, { _id: 'demo_003' }], status: 'At Risk', priority: 'Urgent', color: '#ef4444', tags: ['Mobile', 'Backend'], dueDate: '2026-05-30', progress: 30, tasks: 5, completedTasks: 1, createdAt: new Date() },
  { _id: 'proj_003', name: 'Analytics Dashboard', description: 'Build real-time analytics dashboard.', owner: { _id: 'demo_001', name: 'Alex Johnson', email: 'admin@taskflow.io' }, members: [{ _id: 'demo_001' }], status: 'On Track', priority: 'High', color: '#f59e0b', tags: ['Analytics'], dueDate: '2026-07-01', progress: 20, tasks: 3, completedTasks: 0, createdAt: new Date() },
  { _id: 'proj_004', name: 'API Integration Suite', description: 'Third-party API integrations.', owner: { _id: 'demo_001', name: 'Alex Johnson', email: 'admin@taskflow.io' }, members: [{ _id: 'demo_001' }, { _id: 'demo_002' }], status: 'On Track', priority: 'High', color: '#06b6d4', tags: ['Backend', 'API'], dueDate: '2026-06-20', progress: 65, tasks: 3, completedTasks: 2, createdAt: new Date() },
  { _id: 'proj_005', name: 'Client Portal V2', description: 'Second version with SSO and analytics.', owner: { _id: 'demo_002', name: 'Sarah Chen', email: 'sarah@taskflow.io' }, members: [{ _id: 'demo_002' }, { _id: 'demo_003' }], status: 'In Progress', priority: 'Medium', color: '#22c55e', tags: ['Portal', 'UI'], dueDate: '2026-05-10', progress: 80, tasks: 3, completedTasks: 2, createdAt: new Date() },
];
let demoProjStore = [...demoProjects];


// @desc  Get all projects for logged-in user
// @route GET /api/projects
// @access Protected
export const getProjects = async (req, res) => {
  if (!getConnectionStatus()) return res.json(demoProjStore);
  try {
    const projects = await Project.find({
      $or: [{ owner: req.user._id }, { members: req.user._id }],
    })
      .populate('owner', 'name email avatar')
      .populate('members', 'name email avatar')
      .sort({ createdAt: -1 });

    // Attach live task counts
    const projectsWithCounts = await Promise.all(
      projects.map(async (project) => {
        const totalTasks = await Task.countDocuments({ project: project._id });
        const completedTasks = await Task.countDocuments({ project: project._id, status: 'Completed' });
        const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
        return {
          ...project.toObject(),
          tasks: totalTasks,
          completedTasks,
          progress,
        };
      })
    );

    res.json(projectsWithCounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get single project by ID
// @route GET /api/projects/:id
// @access Protected
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email avatar role')
      .populate('members', 'name email avatar role');

    if (!project) return res.status(404).json({ message: 'Project not found' });

    // Access check
    const isMember =
      project.owner._id.equals(req.user._id) ||
      project.members.some((m) => m._id.equals(req.user._id));
    if (!isMember) return res.status(403).json({ message: 'Access denied' });

    const totalTasks = await Task.countDocuments({ project: project._id });
    const completedTasks = await Task.countDocuments({ project: project._id, status: 'Completed' });
    const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    res.json({ ...project.toObject(), tasks: totalTasks, completedTasks, progress });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Create a new project
// @route POST /api/projects
// @access Protected
export const createProject = async (req, res) => {
  const { name, description, status, priority, color, tags, dueDate } = req.body;
  if (!getConnectionStatus()) {
    const newProj = { _id: `proj_${Date.now()}`, name, description: description || '', status: status || 'In Progress', priority: priority || 'Medium', color: color || '#7c3aed', tags: tags || [], dueDate, owner: req.user, members: [req.user], progress: 0, tasks: 0, completedTasks: 0, createdAt: new Date() };
    demoProjStore.unshift(newProj);
    return res.status(201).json(newProj);
  }
  try {
    const project = await Project.create({
      name,
      description,
      status: status || 'In Progress',
      priority: priority || 'Medium',
      color: color || '#7c3aed',
      tags: tags || [],
      dueDate,
      owner: req.user._id,
      members: [req.user._id],
    });

    const populated = await project.populate('owner', 'name email avatar');
    res.status(201).json({ ...populated.toObject(), tasks: 0, completedTasks: 0, progress: 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Update a project
// @route PUT /api/projects/:id
// @access Protected
export const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (!project.owner.equals(req.user._id))
      return res.status(403).json({ message: 'Only project owner can edit' });

    const updates = ['name', 'description', 'status', 'priority', 'color', 'tags', 'dueDate', 'progress'];
    updates.forEach((field) => {
      if (req.body[field] !== undefined) project[field] = req.body[field];
    });

    await project.save();
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Delete a project (and its tasks)
// @route DELETE /api/projects/:id
// @access Protected
export const deleteProject = async (req, res) => {
  if (!getConnectionStatus()) {
    demoProjStore = demoProjStore.filter(p => p._id !== req.params.id);
    return res.json({ message: 'Project deleted successfully' });
  }
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (!project.owner.equals(req.user._id))
      return res.status(403).json({ message: 'Only project owner can delete' });

    await Task.deleteMany({ project: project._id });
    await project.deleteOne();
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Add a member to a project
// @route POST /api/projects/:id/members
// @access Protected
export const addMember = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const { userId } = req.body;
    if (!project.members.includes(userId)) {
      project.members.push(userId);
      await project.save();
    }
    res.json({ message: 'Member added' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
