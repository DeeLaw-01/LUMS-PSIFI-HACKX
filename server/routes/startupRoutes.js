import express from 'express';
import verifyToken from '../middlewares/verifyToken.js';
import {
  getUserStartups,
  followStartup,
  unfollowStartup,
  leaveStartup
} from '../controllers/startupController.js';

const router = express.Router();

router.get('/user', verifyToken, getUserStartups);
router.post('/:id/follow', verifyToken, followStartup);
router.post('/:id/unfollow', verifyToken, unfollowStartup);
router.post('/:id/leave', verifyToken, leaveStartup);

export default router;