import Task from '../models/Task.js';
import Project from '../models/Project.js';
import { getConnectionStatus } from '../config/db.js';

// ── Demo tasks for no-DB mode ────────────────────────────────────────
let demoTaskStore = [
  { _id: 'task_001', title: 'Design new homepage hero section', description: 'Create a modern engaging hero.', project: { _id: 'proj_001', name: 'Marketing Website Redesign', color: '#3b82f6' }, projectName: 'Marketing Website Redesign', assignee: { _id: 'demo_002', name: 'Sarah Chen', email: 'sarah@taskflow.io' }, reporter: { _id: 'demo_001', name: 'Alex Johnson' }, status: 'In Progress', priority: 'High', dueDate: '2026-05-20', labels: ['Design', 'Frontend'], estimatedHours: 8, timeTracked: 5, order: 0 },
  { _id: 'task_002', title: 'Implement user authentication flow', description: 'JWT-based auth with refresh tokens.', project: { _id: 'proj_002', name: 'Q3 Mobile App Release', color: '#ef4444' }, projectName: 'Q3 Mobile App Release', assignee: { _id: 'demo_003', name: 'Marcus Williams', email: 'marcus@taskflow.io' }, reporter: { _id: 'demo_001', name: 'Alex Johnson' }, status: 'Todo', priority: 'Urgent', dueDate: '2026-05-15', labels: ['Backend', 'Security'], estimatedHours: 12, timeTracked: 0, order: 0 },
  { _id: 'task_003', title: 'Write API documentation', description: 'Document all REST endpoints using OpenAPI 3.0.', project: { _id: 'proj_004', name: 'API Integration Suite', color: '#06b6d4' }, projectName: 'API Integration Suite', assignee: { _id: 'demo_003', name: 'Marcus Williams', email: 'marcus@taskflow.io' }, reporter: { _id: 'demo_001', name: 'Alex Johnson' }, status: 'Completed', priority: 'Medium', dueDate: '2026-05-05', labels: ['Docs', 'API'], estimatedHours: 6, timeTracked: 6, order: 0 },
  { _id: 'task_004', title: 'Fix navigation bug on iOS Safari', description: 'Hamburger menu not closing on iOS.', project: { _id: 'proj_001', name: 'Marketing Website Redesign', color: '#3b82f6' }, projectName: 'Marketing Website Redesign', assignee: { _id: 'demo_003', name: 'Marcus Williams', email: 'marcus@taskflow.io' }, reporter: { _id: 'demo_001', name: 'Alex Johnson' }, status: 'In Review', priority: 'High', dueDate: '2026-05-08', labels: ['Bug', 'Mobile'], estimatedHours: 3, timeTracked: 2, order: 2 },
  { _id: 'task_005', title: 'Optimize database queries', description: 'Add indexes to slow MongoDB aggregations.', project: { _id: 'proj_003', name: 'Analytics Dashboard', color: '#f59e0b' }, projectName: 'Analytics Dashboard', assignee: { _id: 'demo_001', name: 'Alex Johnson', email: 'admin@taskflow.io' }, reporter: { _id: 'demo_003', name: 'Marcus Williams' }, status: 'In Progress', priority: 'High', dueDate: '2026-05-18', labels: ['Backend', 'Performance'], estimatedHours: 8, timeTracked: 3, order: 0 },
  { _id: 'task_006', title: 'Setup CI/CD pipeline', description: 'Automate build and deploy with GitHub Actions.', project: { _id: 'proj_002', name: 'Q3 Mobile App Release', color: '#ef4444' }, projectName: 'Q3 Mobile App Release', assignee: { _id: 'demo_001', name: 'Alex Johnson', email: 'admin@taskflow.io' }, reporter: { _id: 'demo_001', name: 'Alex Johnson' }, status: 'Backlog', priority: 'High', dueDate: '2026-05-25', labels: ['DevOps'], estimatedHours: 10, timeTracked: 0, order: 1 },
  { _id: 'task_007', title: 'Stripe payment integration', description: 'Integrate Stripe Checkout for subscriptions.', project: { _id: 'proj_004', name: 'API Integration Suite', color: '#06b6d4' }, projectName: 'API Integration Suite', assignee: { _id: 'demo_001', name: 'Alex Johnson', email: 'admin@taskflow.io' }, reporter: { _id: 'demo_001', name: 'Alex Johnson' }, status: 'In Review', priority: 'Urgent', dueDate: '2026-05-20', labels: ['Payments'], estimatedHours: 14, timeTracked: 10, order: 1 },
  { _id: 'task_008', title: 'SSO integration with Google', description: 'OAuth2 SSO support for enterprise clients.', project: { _id: 'proj_005', name: 'Client Portal V2', color: '#22c55e' }, projectName: 'Client Portal V2', assignee: { _id: 'demo_003', name: 'Marcus Williams', email: 'marcus@taskflow.io' }, reporter: { _id: 'demo_002', name: 'Sarah Chen' }, status: 'In Progress', priority: 'High', dueDate: '2026-05-18', labels: ['Auth', 'Enterprise'], estimatedHours: 16, timeTracked: 6, order: 2 },
];



// @desc  Get all tasks (filtered by project, status, assignee, etc.)
// @route GET /api/tasks
// @access Protected
export const getTasks = async (req, res) => {
  if (!getConnectionStatus()) {
    const { project, status, priority } = req.query;
    let filtered = [...demoTaskStore];
    if (project) filtered = filtered.filter(t => (t.project?._id || t.project) === project);
    if (status) filtered = filtered.filter(t => t.status === status);
    if (priority) filtered = filtered.filter(t => t.priority === priority);
    return res.json(filtered);
  }
  try {
    const { project, status, priority, assignee } = req.query;

    // Build filter — only tasks from projects user belongs to
    const userProjects = await Project.find({
      $or: [{ owner: req.user._id }, { members: req.user._id }],
    }).select('_id');

    const projectIds = userProjects.map((p) => p._id);
    const filter = { project: { $in: projectIds } };

    if (project) filter.project = project;
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (assignee) filter.assignee = assignee;

    const tasks = await Task.find(filter)
      .populate('project', 'name color')
      .populate('assignee', 'name email avatar')
      .populate('reporter', 'name email avatar')
      .sort({ order: 1, createdAt: -1 });

    // Normalize projectName for frontend compatibility
    const normalized = tasks.map((t) => ({
      ...t.toObject(),
      projectName: t.project?.name || '',
      projectColor: t.project?.color || '#7c3aed',
    }));

    res.json(normalized);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get a single task
// @route GET /api/tasks/:id
// @access Protected
export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('project', 'name color')
      .populate('assignee', 'name email avatar role')
      .populate('reporter', 'name email avatar role')
      .populate('comments.author', 'name avatar');

    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Create a task
// @route POST /api/tasks
// @access Protected
export const createTask = async (req, res) => {
  const { title, description, project, assignee, status, priority, dueDate, labels, estimatedHours } = req.body;
  if (!getConnectionStatus()) {
    const projMeta = { _id: 'proj_001', name: 'Demo Project', color: '#7c3aed' };
    const newTask = { _id: `task_${Date.now()}`, title, description: description || '', project: projMeta, projectName: projMeta.name, assignee: req.user, reporter: req.user, status: status || 'Todo', priority: priority || 'Medium', dueDate, labels: labels || [], estimatedHours: estimatedHours || 0, timeTracked: 0, order: demoTaskStore.length, createdAt: new Date() };
    demoTaskStore.unshift(newTask);
    return res.status(201).json(newTask);
  }
  try {
    // Check project access
    const projectDoc = await Project.findById(project);
    if (!projectDoc) return res.status(404).json({ message: 'Project not found' });

    const isMember =
      projectDoc.owner.equals(req.user._id) ||
      projectDoc.members.some((m) => m.equals(req.user._id));
    if (!isMember) return res.status(403).json({ message: 'Not a project member' });

    const count = await Task.countDocuments({ project });

    const task = await Task.create({
      title,
      description,
      project,
      assignee: assignee || null,
      reporter: req.user._id,
      status: status || 'Todo',
      priority: priority || 'Medium',
      dueDate,
      labels: labels || [],
      estimatedHours: estimatedHours || 0,
      order: count,
    });

    const populated = await task
      .populate('project', 'name color')
      .then((t) => t.populate('assignee', 'name email avatar'))
      .then((t) => t.populate('reporter', 'name email avatar'));

    res.status(201).json({
      ...populated.toObject(),
      projectName: populated.project?.name || '',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Update a task (including status for Kanban drag)
// @route PUT /api/tasks/:id
// @access Protected
export const updateTask = async (req, res) => {
  if (!getConnectionStatus()) {
    const idx = demoTaskStore.findIndex(t => t._id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: 'Task not found' });
    const fields = ['title', 'description', 'status', 'priority', 'dueDate', 'labels', 'estimatedHours', 'timeTracked', 'order'];
    fields.forEach(f => { if (req.body[f] !== undefined) demoTaskStore[idx][f] = req.body[f]; });
    return res.json(demoTaskStore[idx]);
  }
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const fields = ['title', 'description', 'assignee', 'status', 'priority', 'dueDate', 'labels', 'estimatedHours', 'timeTracked', 'order'];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) task[f] = req.body[f];
    });

    const updated = await task.save();

    // Emit socket event for real-time (io is attached to app)
    const io = req.app.get('io');
    if (io) {
      io.to(updated.project.toString()).emit('task_updated', {
        taskId: updated._id,
        status: updated.status,
        updatedBy: req.user.name,
      });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Delete a task
// @route DELETE /api/tasks/:id
// @access Protected
export const deleteTask = async (req, res) => {
  if (!getConnectionStatus()) {
    demoTaskStore = demoTaskStore.filter(t => t._id !== req.params.id);
    return res.json({ message: 'Task deleted' });
  }
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    await task.deleteOne();

    const io = req.app.get('io');
    if (io) {
      io.to(task.project.toString()).emit('task_deleted', { taskId: task._id });
    }

    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Add a comment to a task
// @route POST /api/tasks/:id/comments
// @access Protected
export const addComment = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    task.comments.push({ author: req.user._id, text: req.body.text });
    await task.save();
    await task.populate('comments.author', 'name avatar');

    const newComment = task.comments[task.comments.length - 1];

    const io = req.app.get('io');
    if (io) {
      io.to(task.project.toString()).emit('new_comment', {
        taskId: task._id,
        comment: newComment,
      });
    }

    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
