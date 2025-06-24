// models/Contest.js
import mongoose from 'mongoose';

const ContestSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  duration: { type: Number }, // in minutes
  isPublic: { type: Boolean, default: true },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
  registeredUsers: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
    status: { type: String, enum : ["registered", "suspended", "joined"]}
  }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isPublished: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Contest', ContestSchema);
