import Contest from '../models/Contest.js';

export const createContest = async (req, res) => {
  try {
    const contest = await Contest.create({ ...req.body, createdBy: req.user.userId });
    res.status(201).json(contest);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create contest' });
  }
};

export const getAllContests = async (req, res) => {
  const contests = await Contest.find().populate('questions');
  res.json(contests);
};

export const registerForContest = async (req, res) => {
  const contest = await Contest.findById(req.params.id);
  if (!contest.registeredUsers.includes(req.user.userId)) {
    contest.registeredUsers.push(req.user.userId);
    await contest.save();
  }
  res.json({ message: 'Registered successfully' });
};
