import express from 'express';
import { submitCode, runCode, getSubmissions, getSubmissionById, runCodeWithJudge0, submitCodeWithJudge0 } from '../controllers/submissionController.js';
import { protect } from '../middlewares/auth.js';
import { dailyRateLimiter } from '../middlewares/rateLimit.js';

const router = express.Router();

router.get('/:questionId', protect, getSubmissions);
router.get('/submission/:submissionId', protect, getSubmissionById);
// router.post('/submit', protect, submitCode);
router.post('/submit', protect, dailyRateLimiter, submitCodeWithJudge0);

// router.post('/run', protect, runCode);
router.post('/run', protect, dailyRateLimiter, runCodeWithJudge0);


export default router;
