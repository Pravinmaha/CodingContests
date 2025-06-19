import express from 'express';
import { submitCode } from '../controllers/submissionController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.post('/', protect, submitCode);

export default router;
