import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  status: {
    type: String,
    enum: ['In Progress', 'On Track', 'At Risk', 'Completed', 'Archived'],
    default: 'In Progress',
  },
  priority: { type: String, enum: ['Low', 'Medium', 'High', 'Urgent'], default: 'Medium' },
  progress: { type: Number, default: 0, min: 0, max: 100 },
  color: { type: String, default: '#7c3aed' },
  tags: [{ type: String }],
  dueDate: { type: Date },
}, { timestamps: true });

// Auto-compute progress from tasks
projectSchema.methods.computeProgress = async function () {
  const Task = mongoose.model('Task');
  const total = await Task.countDocuments({ project: this._id });
  if (total === 0) return 0;
  const completed = await Task.countDocuments({ project: this._id, status: 'Completed' });
  return Math.round((completed / total) * 100);
};

const Project = mongoose.model('Project', projectSchema);
export default Project;
