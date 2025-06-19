import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import connectDB from './config/db.js'

import authRoutes from './routes/auth.js';
import contestRoutes from './routes/contest.js';
import questionRoutes from './routes/question.js';
import submissionRoutes from './routes/submission.js';
import leaderboardRoutes from './routes/leaderboard.js';

dotenv.config();
const app = express();

connectDB();
// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/contests', contestRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

app.listen(process.env.PORT || 5000, () => {
    console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
});
