import mongoose from 'mongoose';

const organizationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  domain: { type: String, unique: true },
  logo: { type: String },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, enum: ['Admin', 'Member', 'Guest'], default: 'Member' }
  }],
  settings: {
    allowPublicInvites: { type: Boolean, default: false }
  }
}, { timestamps: true });

const Organization = mongoose.model('Organization', organizationSchema);
export default Organization;
