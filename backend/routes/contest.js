import express from 'express';
import { addQuestionToContest, createContest, editContest, getAllContests, getContestById, getFullContestById, getMyContests, joinContest, registerForContest, removeQuestionFromContest } from '../controllers/contestController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.post('/', protect, createContest);
router.post('/addquestions/:contestId', protect, addQuestionToContest);
router.post('/removequestion/:contestId', protect, removeQuestionFromContest);
router.post('/edit/:contestId', protect, editContest);
router.get('/', getAllContests);
router.get('/mycontests', protect, getMyContests);
router.get('/:contestId', getContestById);
router.get('/full/:contestId', protect, getFullContestById);

router.post('/register/:id', protect, registerForContest);
// router.post('/join/:id', protect, joinContest);


export default router;
