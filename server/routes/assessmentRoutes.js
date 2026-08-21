import express from 'express';
import { scanProjectCodebase, getAssessmentsByProject } from '../controllers/assessmentController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/scan/:projectId', protect, upload.single('codebase'), scanProjectCodebase);
router.get('/project/:projectId', protect, getAssessmentsByProject);

export default router;

