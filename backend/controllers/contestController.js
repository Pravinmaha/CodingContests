import Contest from '../models/Contest.js';
import User from '../models/User.js';

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
    const { newQuestions } = req.body; // Expecting: [{ question: ObjectId, score: Number }, ...]

    const contest = await Contest.findById(contestId);

    if (!contest) {
      return res.status(404).json({ error: 'Contest not found' });
    }

    // Existing question IDs in the contest
    const existingIds = new Set(contest.questions.map(q => q.question.toString()));

    // Filter out only new question objects (not already in the contest)
    const filteredNewQuestions = newQuestions.filter(
      q => !existingIds.has(q.question.toString())
    );

    // Push the filtered new questions
    contest.questions.push(...filteredNewQuestions);

    await contest.save();

    // Populate question details
    const updatedContest = await Contest.findById(contestId)
      .populate('questions.question')
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

    // Filter out the question object with the matching questionId
    contest.questions = contest.questions.filter(
      q => q.question.toString() !== questionId
    );

    await contest.save();

    // Populate after saving
    const updatedContest = await Contest.findById(contestId)
      .populate('questions.question')
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
      .populate('questions.question')
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
      .populate('questions.question')
      .populate({
        path: 'registeredUsers.user',
        select: '-password',
      });

    if (!contest) {
      return res.status(404).json({ error: 'Contest not found' });
    }

    const userId = req.user.userId;
    const now = new Date();
    const start = new Date(contest.startTime);
    const end = new Date(contest.endTime);

    const isCreator = contest.createdBy.toString() === userId;
    const isRegistered = contest.registeredUsers.some(
      (entry) => entry.user && entry.user._id.toString() === userId
    );

    const isBeforeStart = now < start;
    const hasEnded = now > end;

    // Block access to unpublished/private contests
    if (!isCreator && (!contest.isPublished || !contest.isPublic)) {
      return res.status(404).json({ message: 'Contest not found' });
    }

    // Hide questions if:
    // - User is NOT creator
    // - AND contest has NOT started
    // - OR user is NOT registered
    if (!isCreator && (isBeforeStart || (!hasEnded && !isRegistered))) {
      const sanitizedContest = contest.toObject();
      sanitizedContest.questions = [];
      return res.status(200).json(sanitizedContest);
    }

    return res.status(200).json(contest);
  } catch (err) {
    console.error('Error in getFullContestById:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};





export const getAllContests = async (req, res) => {
  const contests = await Contest.find({ isPublic: true, isPublished: true })
  // .populate('questions');
  res.json(contests);
};

export const registerForContest = async (req, res) => {
  try {
    const contest = await Contest.findById(req.params.id);
    if (!contest || !contest.isPublished || !contest.isPublic) {
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

export const suspendUserInContest = async (req, res) => {
  try {
    const { contestId, userId } = req.params;

    const contest = await Contest.findById(contestId);
    if (!contest) {
      return res.status(404).json({ message: 'Contest not found' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if(req.user.userId !== contest.createdBy?.toString()){
      return res.status(403).json({ message: 'Unauthorised access' });

    }

    const existingEntry = contest.registeredUsers.find(
      (entry) => entry.user.toString() === user._id.toString()
    );

    if (!existingEntry) {
      // User wasn't registered, add with suspended status
      contest.registeredUsers.push({ user: user._id, status: 'suspended' });
    } else if (existingEntry.status !== 'suspended') {
      // User was registered, update status if needed
      existingEntry.status = 'suspended';
    } // else: already suspended, no change needed

    await contest.save();
    return res.status(200).json({ message: 'User suspended successfully' });

  } catch (error) {
    console.error('Suspend User Error:', error);
    res.status(500).json({ message: 'Server error while suspending user in contest' });
  }
};

export const unsuspendUserInContest = async (req, res) => {
  try {
    const { contestId, userId } = req.params;

    const contest = await Contest.findById(contestId);
    if (!contest) {
      return res.status(404).json({ message: 'Contest not found' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if(req.user.userId !== contest.createdBy?.toString()){
      return res.status(403).json({ message: 'Unauthorised access' });

    }

    const existingEntry = contest.registeredUsers.find(
      (entry) => entry.user.toString() === user._id.toString()
    );

    if (!existingEntry) {
      // If not already in registeredUsers, add with 'unsuspend' status
      contest.registeredUsers.push({ user: user._id, status: 'unsuspended' });
    } else if (existingEntry.status !== 'unsuspended') {
      // Update status only if different
      existingEntry.status = 'unsuspended';
    } // If already unsuspended, do nothing

    await contest.save();
    return res.status(200).json({ message: 'User unsuspended successfully' });

  } catch (error) {
    console.error('Unsuspend User Error:', error);
    res.status(500).json({ message: 'Server error while unsuspending user in contest' });
  }
};
