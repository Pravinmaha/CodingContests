import Submission from '../models/Submission.js';
import axios from 'axios';
import Question from '../models/Question.js';
import TestCase from '../models/TestCase.js';
import QuestionVersion from '../models/QuestionVersion.js';

export const submitCode = async (req, res) => {
  try {
    const { code, language, questionId, contestId } = req.body;

    const question = await Question.findById(questionId);
    if (!question) return res.status(404).json({ error: 'Question not found' });

    const testCases = question.testCases;
    let verdict = 'Accepted';
    let input = '';

    for (const tc of testCases) {
      input += tc.input + '\n';
    }
    const response = await axios.post(`${process.env.CODE_API}/api/run`, {
      code,
      language,
      input
    });

    const output = response.data.stdout?.trim();
    if (output !== tc.output.trim()) {
      verdict = 'Wrong Answer';
    }

    const submission = await Submission.create({
      user: req.user.userId,
      question: questionId,
      contest: contestId,
      code,
      language,
      verdict,
    });

    res.status(200).json({ verdict, submission });
  } catch (err) {
    res.status(500).json({ error: 'Submission failed', details: err.message });
  }
};

export const runCode = async (req, res) => {
  try {
    const { code, language, questionId, testCases } = req.body;

    const question = await Question.findById(questionId);
    if (!question) return res.status(404).json({ error: 'Question not found' });

    // const testCases = await TestCase.find({questionId});
    const version = await QuestionVersion.findOne({language, questionId})
    // console.log(version.runnerCode.replace('// RUNNER_CODE', code))
    let replaceComment = (language === 'python') ? '# RUNNER_CODE' : '// RUNNER_CODE';
    const codeToExecute = version.runnerCode.replace(replaceComment, `${version.referenceSolution+'\n'+code}`);
    let input = '';

    for (const tc of testCases) {
      input += tc;
    }
    const response = await axios.post(`${process.env.CODE_API}/api/run`, {
      code:codeToExecute,
      language,
      input
    });

    const output = response.data;
    res.status(200).json(output);
  } catch (err) {
    console.log(err.message)
    res.status(500).json({ message: err.response.data.error });
  }
};
