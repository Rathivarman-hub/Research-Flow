import express from 'express';
import { checkReproducibility, getReproducibilityByProject } from '../controllers/reproducibilityController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/check/:projectId', protect, upload.array('files', 5), checkReproducibility);
router.get('/project/:projectId', protect, getReproducibilityByProject);

export default router;

