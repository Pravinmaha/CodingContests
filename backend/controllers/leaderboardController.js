import mongoose from 'mongoose';
import Submission from '../models/Submission.js';
import Contest from '../models/Contest.js';
import User from '../models/User.js';

export const getLeaderboard = async (req, res) => {
  const contestId = req.params.contestId;

  try {
    const contest = await Contest.findById(contestId).lean();
    if (!contest) return res.status(404).json({ message: 'Contest not found' });

    const startTime = new Date(contest.startTime);
    const endTime = new Date(contest.endTime);

    const questionScores = {};
    contest.questions.forEach(q => {
      questionScores[q.question.toString()] = q.score || 0;
    });

    // Only consider submissions made within contest time range
    const allSubmissions = await Submission.find({
      contest: contestId,
      createdAt: { $gte: startTime, $lte: endTime }
    })
      .sort({ createdAt: 1 }) // ensure earliest processed first
      .lean();

    const userStats = {};

    for (const sub of allSubmissions) {
      const userId = sub.user.toString();
      const questionId = sub.question.toString();

      if (!userStats[userId]) {
        userStats[userId] = {
          user: null,
          totalScore: 0,
          totalTime: 0,
          questions: {},
        };
      }

      const userEntry = userStats[userId];

      if (!userEntry.questions[questionId]) {
        userEntry.questions[questionId] = {
          accepted: false,
          penaltyCount: 0,
          acceptedCode: '',
          time: 0
        };
      }

      const qStat = userEntry.questions[questionId];

      if (qStat.accepted) continue;

      if (sub.verdict === 'Accepted') {
        const timeTakenSec = Math.floor((new Date(sub.createdAt) - startTime) / 1000);
        const penaltyTime = qStat.penaltyCount * 300;
        const totalTime = timeTakenSec + penaltyTime;

        qStat.accepted = true;
        qStat.time = totalTime;
        qStat.acceptedCode = sub.code;

        userEntry.totalScore += questionScores[questionId] || 0;
        userEntry.totalTime += totalTime;
      } else {
        qStat.penaltyCount += 1;
      }
    }

    // Populate user names
    const userIds = Object.keys(userStats);
    const users = await User.find({ _id: { $in: userIds } }).lean();

    for (const user of users) {
      if (userStats[user._id.toString()]) {
        userStats[user._id.toString()].user = user.name;
      }
    }

    const leaderboard = Object.values(userStats).map(entry => ({
      user: entry.user || 'Unknown',
      totalScore: entry.totalScore,
      totalTime: entry.totalTime,
      questions: entry.questions
    }));

    leaderboard.sort((a, b) => {
      if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
      return a.totalTime - b.totalTime;
    });

    res.json(leaderboard);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
