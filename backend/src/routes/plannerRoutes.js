import { Router } from 'express';
import {
  getPlannerItems,
  createPlannerItem,
  updatePlannerItem,
  deletePlannerItem,
} from '../controllers/plannerController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();
router.use(protect);

router.route('/').get(getPlannerItems).post(createPlannerItem);
router.route('/:id').put(updatePlannerItem).delete(deletePlannerItem);

export default router;
