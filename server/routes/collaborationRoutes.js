import express from 'express';
import {
  getChatMessages,
  postChatMessage,
  getNotifications,
  markNotificationRead,
  getActivityLogs,
} from '../controllers/collaborationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/chat/:projectId', protect, getChatMessages);
router.post('/chat/:projectId', protect, postChatMessage);
router.get('/notifications', protect, getNotifications);
router.put('/notifications/:id/read', protect, markNotificationRead);
router.get('/activity/:projectId', protect, getActivityLogs);

export default router;

