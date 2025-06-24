import express from 'express';
import { submitCode, runCode } from '../controllers/submissionController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.post('/', protect, submitCode);
router.post('/run', protect, runCode);

export default router;
