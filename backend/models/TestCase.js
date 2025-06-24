import mongoose from 'mongoose';

const TestCaseSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  },
  input: {
    type: String,
    required: true
  },
  output: { type: String, required: true },
  isPublic: { type: Boolean, default: false }
});

export default mongoose.model('TestCase', TestCaseSchema);
