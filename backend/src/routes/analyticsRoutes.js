import { Router } from 'express';
import { getAnalytics } from '../controllers/analyticsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();
router.get('/', protect, getAnalytics);

export default router;
