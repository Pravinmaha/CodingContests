import mongoose from 'mongoose';

const QuestionVersionSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  },
  language: {
    type: String,
    enum: ['python', 'cpp', 'java', 'js', 'c'],
    required: true
  },
  workingCode: { type: String, required: true },
  starterCode: { type: String },
  runnerCode: { type: String }, // base test runner
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('QuestionVersion', QuestionVersionSchema);
