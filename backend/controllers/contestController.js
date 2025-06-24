import Contest from '../models/Contest.js';

export const createContest = async (req, res) => {
  try {
    const contest = await Contest.create({ ...req.body, createdBy: req.user.userId });
    res.status(201).json(contest);
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ error: 'Failed to create contest' });
  }
};

export const addQuestionToContest = async (req, res) => {
  try {
    const { contestId } = req.params;
    const { questionIds } = req.body;

    const contest = await Contest.findById(contestId);

    if (!contest) {
      return res.status(404).json({ error: 'Contest not found' });
    }

    // Filter out already added questionIds
    const existingIds = new Set(contest.questions.map(id => id.toString()));
    const newIds = questionIds.filter(id => !existingIds.has(id));

    // Add only new questionIds
    contest.questions.push(...newIds);
    await contest.save();

    // Populate after saving
    const updatedContest = await Contest.findById(contestId)
      .populate('questions')
      .populate('registeredUsers.user');

    return res.status(200).json(updatedContest);

  } catch (err) {
    console.error('Add question to contest error:', err.message);
    res.status(400).json({ error: 'Failed to add questions to contest' });
  }
};

export const removeQuestionFromContest = async (req, res) => {
  try {
    const { contestId } = req.params;
    const { questionId } = req.body;

    const contest = await Contest.findById(contestId);

    if (!contest) {
      return res.status(404).json({ error: 'Contest not found' });
    }

    // Remove the questionId from the contest's questions array
    contest.questions = contest.questions.filter(
      id => id.toString() !== questionId
    );

    await contest.save();

    // Populate after saving
    const updatedContest = await Contest.findById(contestId)
      .populate('questions')
      .populate('registeredUsers.user');

    return res.status(200).json(updatedContest);

  } catch (err) {
    console.error('Remove question from contest error:', err.message);
    res.status(400).json({ error: 'Failed to remove question from contest' });
  }
};



export const editContest = async (req, res) => {
  try {
    const { contestId } = req.params;
    const { title, description, startTime, endTime, duration, isPublic, isPublished } = req.body;

    const updatedContest = await Contest.findByIdAndUpdate(
      contestId,
      { title, description, startTime, endTime, duration, isPublic, isPublished },
      { new: true }
    );

    if (!updatedContest) {
      return res.status(404).json({ error: 'Contest not found' });
    }

    const contest = await Contest.findById(contestId)
      .populate('questions')
      .populate('registeredUsers.user')

    return res.status(200).json(contest);

  } catch (err) {
    console.error('Edit contest error:', err.message);
    res.status(400).json({ error: 'Failed to edit contest' });
  }
};


export const getMyContests = async (req, res) => {
  const contests = await Contest.find({ createdBy: req.user.userId })
  // .populate('questions');
  res.json(contests);
};

export const getContestById = async (req, res) => {
  try {
    const { contestId } = req.params;

    const contest = await Contest.findById(contestId).select(" -questions")

    if (!contest) {
      return res.status(404).json({ error: 'Contest not found' });
    }

    return res.status(200).json(contest);
  } catch (err) {
    console.error('Error in getContestById:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

export const getFullContestById = async (req, res) => {
  try {
    const { contestId } = req.params;

    const contest = await Contest.findById(contestId)
      .populate('questions')
      .populate({
        path: 'registeredUsers.user',
        select: '-password'
      });

    if (!contest) {
      return res.status(404).json({ error: 'Contest not found' });
    }

    const userId = req.user.userId; // assuming you attach userId to req.user in auth middleware

    const now = new Date();
    const start = new Date(contest.startTime);
    const end = new Date(contest.endTime);

    const isCreator = contest.createdBy.toString() === userId;

    if (!isCreator && (now < start 
      // || now > end
    )) {
      return res.status(403).json({ error: 'You are not allowed to access this contest now' });
    }

    return res.status(200).json(contest);
  } catch (err) {
    console.error('Error in getContestById:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};


export const getAllContests = async (req, res) => {
  const contests = await Contest.find({ isPublic: true })
  // .populate('questions');
  res.json(contests);
};

export const registerForContest = async (req, res) => {
  try {
    const contest = await Contest.findById(req.params.id);
    if (!contest) {
      return res.status(404).json({ message: 'Contest not found' });
    }

    const alreadyRegistered = contest.registeredUsers.some(
      (entry) => entry.user.toString() === req.user.userId
    );

    if (!alreadyRegistered) {
      contest.registeredUsers.push({ user: req.user.userId, status: "registered" });
      await contest.save();
    }

    res.json({ message: 'Registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const joinContest = async (req, res) => {
  try {
    const contest = await Contest.findById(req.params.id);
    if (!contest) {
      return res.status(404).json({ message: 'Contest not found' });
    }

    const now = new Date();
    const start = new Date(contest.startTime);
    const end = new Date(contest.endTime);

    if (now < start || now > end) {
      return res.status(403).json({ message: 'Contest is not active currently' });
    }

    const existingEntry = contest.registeredUsers.find(
      (entry) => entry.user.toString() === req.user.userId
    );

    if (!existingEntry) {
      contest.registeredUsers.push({ user: req.user.userId, status: 'joined' });
      await contest.save();
      return res.json({ message: 'Joined successfully' });
    }

    // Optional: update status if needed
    if (existingEntry.status !== 'joined') {
      existingEntry.status = 'joined';
      await contest.save();
      return res.json({ message: 'Joined successfully' });
    }

    res.json({ message: 'Joined successfully' });
  } catch (error) {
    console.error('Join Contest Error:', error);
    res.status(500).json({ message: 'Server error while joining contest' });
  }
};
