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
  referenceSolution: { type: String, required: true },
  starterCode: { type: String, required: true  },
  runnerCode: { type: String, required: true  }, // base test runner
  submitCode: { type: String, required: true  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('QuestionVersion', QuestionVersionSchema);
