import express from 'express';
import { generateDoc, exportPdf, mentorChat } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/generate-doc/:projectId', protect, generateDoc);
router.post('/export-pdf', protect, exportPdf);
router.post('/mentor-chat', protect, mentorChat);

export default router;

