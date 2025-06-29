import express from 'express';
import { submitCode, runCode, getSubmissions, getSubmissionById } from '../controllers/submissionController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.get('/:questionId', protect, getSubmissions);
router.get('/submission/:submissionId', protect, getSubmissionById);
router.post('/submit', protect, submitCode);
router.post('/run', protect, runCode);

export default router;
