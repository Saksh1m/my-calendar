import { Router } from 'express';
import { getSources, createSource, deleteSource } from '../controllers/sourceController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();
router.use(protect);

router.route('/').get(getSources).post(createSource);
router.delete('/:id', deleteSource);

export default router;
