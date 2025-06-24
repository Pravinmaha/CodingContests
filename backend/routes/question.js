import express from 'express';
import { addQuestion, getAdminQuestions, getCompleteQuestionById } from '../controllers/questionController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.post('/', protect, addQuestion);
router.get('/', protect, getAdminQuestions);
router.get('/:id', protect, getCompleteQuestionById);

export default router;
