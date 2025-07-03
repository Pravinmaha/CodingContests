import Submission from '../models/Submission.js';
import axios from 'axios';
import Question from '../models/Question.js';
import TestCase from '../models/TestCase.js';
import QuestionVersion from '../models/QuestionVersion.js';

export const submitCode = async (req, res) => {
  try {
    const { code, language, questionId, contestId } = req.body;
    const userId = req.user.userId;

    const question = await Question.findById(questionId);
    if (!question) return res.status(404).json({ error: 'Question not found' });

    const testCases = await TestCase.find({ questionId }).lean();

    const version = await QuestionVersion.findOne({ language, questionId });
    if (!version) return res.status(400).json({ error: "Question version not found" });

    let replaceComment = (language === 'python') ? '# SUBMIT_CODE' : '// SUBMIT_CODE';
    const codeToExecute = version.submitCode.replace(replaceComment, `${'\n' + code}`);

    let verdict = 'Accepted';
    let input = '';
    for (const tc of testCases) {
      input += tc.input + '\n' + tc.output + "\n";
    }

    const response = await axios.post(`${process.env.CODE_API}/api/run`, {
      code: codeToExecute,
      language,
      input
    });

    const data = response.data;
    if (data?.output?.includes("Failed")) {
      verdict = 'Wrong Answer';
    }

    const submissionTestCases = [];
    const outputs = data?.output?.substring(data?.output?.indexOf("[")).replace("[", "").replace("]", "").split(",");
    for (let i = 0; i < testCases.length && outputs?.length; i++) {
      submissionTestCases.push({ testCase: testCases[i]._id, status: outputs[i].trim() });
    }

    const createdSubmission = await Submission.create({
      user: userId,
      contest: contestId,
      question: questionId,
      code,
      testCases: submissionTestCases,
      language,
      verdict,
      executionTime: Math.floor(data.time * 1000),
      memoryUsed: Math.floor(data.memory / 1024),
    });

    // Populate relevant fields
    const populated = await Submission.findById(createdSubmission._id)
      .populate("user", "_id name")
      .populate("contest", "startTime endTime")
      .populate("question", "createdBy")
      .populate("testCases.testCase");

    // Determine visibility logic
    const now = new Date();
    const isCreator = populated.question.createdBy.toString() === userId;
    const { startTime, endTime } = populated.contest || {};
    const inContestTime = startTime && endTime && now >= startTime && now <= endTime;

    const responseSubmission = {
      _id: populated._id,
      verdict: populated.verdict,
      code: populated.code,
      language: populated.language,
      memoryUsed: populated.memoryUsed,
      executionTime: populated.executionTime,
      createdAt: populated.createdAt,
      contest: populated.contest,
      question: populated.question._id,
      testCases: populated.testCases.map(t => {
        if (isCreator || now > endTime) {
          return {
            testCase: {
              input: t.testCase?.input,
              output: t.testCase?.output,
              isPublic: t.testCase?.isPublic,
            },
            status: t.status,
          };
        } else {
          return {
            testCase: t.testCase?._id,
            status: t.status,
          };
        }
      }),
    };

    res.status(200).json(responseSubmission);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err?.response?.statusText, message: err?.response?.data, errorMessage: err.message });
  }
};


export const getSubmissions = async (req, res) => {
  try {
    const { questionId } = req.params;
    const userId = req.user.userId;

    const submissions = await Submission.find({ user: userId, question: questionId })
      .populate("user", "_id name")
      .populate("contest", "startTime endTime")
      .populate("question", "createdBy")
      .populate("testCases.testCase");

    if (!submissions || submissions.length === 0) {
      return res.status(201).json({ message: "No submissions found." });
    }

    const isCreator = submissions[0].question.createdBy.toString() === userId;

    const now = new Date();
    const { startTime, endTime } = submissions[0].contest || {};
    const inContestTime = startTime && endTime && now >= startTime && now <= endTime;

    const visibleSubmissions = submissions.filter((sub) => {
      if (isCreator) return true; // creator sees everything
      if (inContestTime) {
        // during contest, only show user’s submissions made during contest
        return sub.createdAt >= startTime && sub.createdAt <= endTime;
      }
      return true; // before or after contest, show all to the user
    });

    const sanitizedSubmissions = visibleSubmissions.map((sub) => {
      const base = {
        _id: sub._id,
        verdict: sub.verdict,
        code: sub.code,
        language: sub.language,
        memoryUsed: sub.memoryUsed,
        executionTime: sub.executionTime,
        createdAt: sub.createdAt,
        contest: sub.contest,
        question: sub.question._id,
      };

      const showFullTestCases = isCreator || (endTime && now > endTime);

      base.testCases = sub.testCases.map((t) => {
        return showFullTestCases
          ? {
              testCase: {
                input: t.testCase?.input,
                output: t.testCase?.output,
                isPublic: t.testCase?.isPublic,
              },
              status: t.status,
            }
          : {
              testCase: t.testCase?._id,
              status: t.status,
            };
      });

      return base;
    });

    res.status(200).json(sanitizedSubmissions);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: err.message });
  }
};


export const getSubmissionById = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const userId = req.user.userId;

    const submission = await Submission.findById(submissionId)
      .populate("user", "_id name")
      .populate("contest", "startTime endTime")
      .populate("question", "createdBy")
      .populate("testCases.testCase");

    if (!submission) {
      return res.status(404).json({ message: "Submission not found." });
    }

    // Access control
    if (submission.user._id.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized access to submission." });
    }

    const isCreator = submission.question.createdBy.toString() === userId;
    const now = new Date();
    const { startTime, endTime } = submission.contest || {};
    const inContestTime = startTime && endTime && now >= startTime && now <= endTime;

    const sanitized = {
      _id: submission._id,
      verdict: submission.verdict,
      code: submission.code,
      language: submission.language,
      memoryUsed: submission.memoryUsed,
      executionTime: submission.executionTime,
      createdAt: submission.createdAt,
      contest: submission.contest,
      question: submission.question._id,
    };

    if (isCreator || now > endTime) {
      sanitized.testCases = submission.testCases.map((t) => ({
        testCase: {
          input: t.testCase?.input,
          output: t.testCase?.output,
          isPublic: t.testCase?.isPublic,
        },
        status: t.status,
      }));
    } else {
      sanitized.testCases = submission.testCases.map((t) => ({
        testCase: t.testCase?._id,
        status: t.status,
      }));
    }

    return res.status(200).json(sanitized);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: err.message });
  }
};



export const runCode = async (req, res) => {
  try {
    const { code, language, questionId, testCases } = req.body;

    const question = await Question.findById(questionId);
    if (!question) return res.status(404).json({ error: 'Question not found' });

    // const testCases = await TestCase.find({questionId});
    const version = await QuestionVersion.findOne({ language, questionId })
    // console.log(version.runnerCode.replace('// RUNNER_CODE', code))
    let replaceComment = (language === 'python') ? '# RUNNER_CODE' : '// RUNNER_CODE';
    const codeToExecute = version.runnerCode.replace(replaceComment, `${code + '\n' + version.referenceSolution }`);
    let input = '';

    for (const tc of testCases) {
      input += tc;
    }
    const response = await axios.post(`${process.env.CODE_API}/api/run`, {
      code: codeToExecute,
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
