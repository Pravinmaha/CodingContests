import Question from '../models/Question.js';
import QuestionVersion from '../models/QuestionVersion.js';
import TestCase from '../models/TestCase.js';

export const addQuestion = async (req, res) => {
  try {
    const {
      title,
      description,
      examples,
      constraints,
      difficulty,
      tags,
      testCases,
      versions
    } = req.body;

    // Step 1: Create the main question
    const question = await Question.create({
      title,
      description,
      examples,
      constraints,
      difficulty,
      tags,
      createdBy: req.user.userId
    });

    // Step 2: Add versions
    const versionPromises = versions.map(v =>
      QuestionVersion.create({ ...v, questionId: question._id })
    );

    // Step 3: Add test cases
    const testCasePromises = testCases.map(test =>
      TestCase.create({ ...test, questionId: question._id })
    );

    await Promise.all([...versionPromises, ...testCasePromises]);

    res.status(201).json({ message: "Question added successfully" });

  } catch (err) {
    console.error(err); // Helpful for debugging
    res.status(400).json({ error: 'Could not create question' });
  }
};


export const updateQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;
    const {
      title,
      description,
      examples,
      constraints,
      difficulty,
      tags,
      testCases,
      versions
    } = req.body;

    // Step 1: Update the main question
    const updatedQuestion = await Question.findByIdAndUpdate(
      questionId,
      { title, description, examples, constraints, difficulty, tags },
      { new: true }
    );

    if (!updatedQuestion) {
      return res.status(404).json({ error: 'Question not found' });
    }

    // Step 2: Remove old versions and test cases
    await Promise.all([
      QuestionVersion.deleteMany({ questionId }),
      TestCase.deleteMany({ questionId })
    ]);

    // Step 3: Add updated versions
    const versionPromises = versions.map(v =>
      QuestionVersion.create({ ...v, questionId })
    );
    // console.log(versions)

    // Step 4: Add updated test cases
    const testCasePromises = testCases.map(test =>
      TestCase.create({ ...test, questionId })
    );

    await Promise.all([...versionPromises, ...testCasePromises]);

    res.status(200).json({ message: 'Question updated successfully' });

  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Failed to update question' });
  }
};


export const getAdminQuestions = async (req, res) => {
  try {
    const userId = req.user.userId; // Make sure this is set by your auth middleware

    const questions = await Question.find({ createdBy: userId });

    res.status(200).json(questions);
  } catch (error) {
    console.error('Error fetching user questions:', error);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
};

export const getCompleteQuestionById = async (req, res) => {
  try {
    const questionId = req.params.id;

    const userId = req.user.userId;

    // 1. Get the main question
    const question = await Question.findById(questionId).lean();
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    // 2. Get all versions for the question
    const versions = await QuestionVersion.find({ questionId }).lean();

    // 3. Get all test cases for the question
    const testCases = await TestCase.find({ questionId }).lean();
    // 4. Return combined data
    return res.status(200).json({
      ...question,
      versions,
      testCases: userId === question.createdBy?.toString() ? testCases : null
    });
  } catch (err) {
    console.error('Error fetching full question:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};