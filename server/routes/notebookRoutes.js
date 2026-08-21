import express from 'express';
import { uploadNotebookFile, getNotebooksByProject, deleteNotebookFile } from '../controllers/notebookController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/upload/:projectId', protect, upload.single('file'), uploadNotebookFile);
router.get('/project/:projectId', protect, getNotebooksByProject);
router.delete('/:id', protect, deleteNotebookFile);

export default router;

