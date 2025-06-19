import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  examples: [{
    inputs: [{ 
      inputKey: { type: String, required: true },
      inputValue: { type: String, required: true },
    }],
    output: { type: String, required: true },
    explanation: { type: String, required: true },
  }],
  constraints: [{
    type: String,
    required: true
  }],
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  tags: [{ type: String }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Question', QuestionSchema);
