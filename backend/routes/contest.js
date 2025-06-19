import express from 'express';
import { createContest, getAllContests, registerForContest } from '../controllers/contestController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.post('/', protect, createContest);
router.get('/', getAllContests);
router.post('/register/:id', protect, registerForContest);

export default router;
