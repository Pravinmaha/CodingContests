import Question from '../models/Question.js';

export const addQuestion = async (req, res) => {
  try {
    const question = await Question.create({ ...req.body, createdBy: req.user.userId });
    res.status(201).json(question);
  } catch (err) {
    res.status(400).json({ error: 'Could not create question' });
  }
};

export const getQuestion = async (req, res) => {
  const fullQuestion = await Question.findById(req.params.id)
  .lean()
  .populate([
    { path: 'createdBy', select: 'username' },
    { path: 'testCases', model: 'TestCase' },
    // {
    //   path: 'questionVersions',
    //   match: { language: 'python' },
    //   model: 'QuestionVersion'
    // }
  ]);

  res.json(fullQuestion);
};
