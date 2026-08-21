import express from 'express';
import { connectGithubRepo, getRepoDetails, getRepoAnalytics } from '../controllers/githubController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/connect/:projectId', protect, connectGithubRepo);
router.get('/details/:projectId', protect, getRepoDetails);
router.get('/analytics/:projectId', protect, getRepoAnalytics);

export default router;

