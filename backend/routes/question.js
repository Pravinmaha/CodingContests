import express from 'express';
import { addQuestion, getQuestion } from '../controllers/questionController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.post('/', protect, addQuestion);
router.get('/:id', protect, getQuestion);

export default router;
