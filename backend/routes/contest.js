import express from 'express';
import { addQuestionToContest, createContest, editContest, getAllContests, getContestById, getFullContestById, getMyContests, registerForContest, removeQuestionFromContest, suspendUserInContest, unsuspendUserInContest } from '../controllers/contestController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.post('/', protect, createContest);
router.post('/addquestions/:contestId', protect, addQuestionToContest);
router.post('/removequestion/:contestId', protect, removeQuestionFromContest);
router.post('/edit/:contestId', protect, editContest);
router.get('/', getAllContests);
router.get('/mycontests', protect, getMyContests);
router.get('/:contestId', getContestById);
router.get('/full/:contestId', getFullContestById);
router.post('/register/:id', protect, registerForContest);
router.post('/:contestId/suspend/:userId', protect, suspendUserInContest); // admin access only
router.post('/:contestId/unsuspend/:userId', protect, unsuspendUserInContest); // admin access only


export default router;
