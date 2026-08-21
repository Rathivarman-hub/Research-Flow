import express from 'express';
import { getProjectAnalytics, getLeaderboard } from '../controllers/analyticsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/project/:projectId', protect, getProjectAnalytics);
router.get('/leaderboard', protect, getLeaderboard);

export default router;

