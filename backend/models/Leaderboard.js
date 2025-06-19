// models/Leaderboard.js
import mongoose from 'mongoose';

const LeaderboardSchema = new mongoose.Schema({
  contest: { type: mongoose.Schema.Types.ObjectId, ref: 'Contest', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  score: { type: Number, default: 0 },
  penalty: { type: Number, default: 0 }, // optional
  submissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Submission' }]
});

export default mongoose.model('Leaderboard', LeaderboardSchema);
