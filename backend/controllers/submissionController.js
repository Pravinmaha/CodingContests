import Submission from '../models/Submission.js';
import axios from 'axios';
import Question from '../models/Question.js';

export const submitCode = async (req, res) => {
  try {
    const { code, language, questionId, contestId } = req.body;

    const question = await Question.findById(questionId);
    if (!question) return res.status(404).json({ error: 'Question not found' });

    const testCases = question.testCases;
    let verdict = 'Accepted';

    for (const tc of testCases) {
      const response = await axios.post('http://localhost:5000/api/run', {
        code,
        language,
        input: tc.input,
      });

      const output = response.data.stdout?.trim();
      if (output !== tc.output.trim()) {
        verdict = 'Wrong Answer';
        break;
      }
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
