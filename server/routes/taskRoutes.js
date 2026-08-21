import express from 'express';
import {
  createTask,
  getTasksByProject,
  updateTask,
  deleteTask,
  addTaskComment,
} from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createTask);
router.get('/project/:projectId', protect, getTasksByProject);
router.route('/:id')
  .put(protect, updateTask)
  .delete(protect, deleteTask);
router.post('/:id/comments', protect, addTaskComment);

export default router;

