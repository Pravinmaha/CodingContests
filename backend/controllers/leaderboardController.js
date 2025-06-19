import Submission from '../models/Submission.js';

export const getLeaderboard = async (req, res) => {
  const contestId = req.params.contestId;

  const leaderboard = await Submission.aggregate([
    { $match: { contest: new mongoose.Types.ObjectId(contestId), verdict: 'Accepted' } },
    {
      $group: {
        _id: '$user',
        score: { $sum: 100 },
        submissions: { $push: '$_id' },
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user',
      },
    },
    { $unwind: '$user' },
    {
      $project: {
        _id: 0,
        user: '$user.name',
        score: 1,
      },
    },
    { $sort: { score: -1 } },
  ]);

  res.json(leaderboard);
};
