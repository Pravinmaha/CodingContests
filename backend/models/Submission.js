// models/Submission.js
import mongoose from 'mongoose';

const SubmissionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  contest: { type: mongoose.Schema.Types.ObjectId, ref: 'Contest' },
  question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
  code: { type: String, required: true },
  language: { type: String, enum: ['cpp', 'java', 'python', 'js'], required: true },
  verdict: { type: String, enum: ['Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Runtime Error', 'Compilation Error'], required: true },
  executionTime: { type: Number }, // in ms
  memoryUsed: { type: Number }, // in KB
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Submission', SubmissionSchema);
