import { Router } from 'express';
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  toggleTask,
} from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();
router.use(protect);

router.route('/').get(getTasks).post(createTask);
router.route('/:id').get(getTask).put(updateTask).delete(deleteTask);
router.patch('/:id/toggle', toggleTask);

export default router;
