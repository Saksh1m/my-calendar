import { Router } from 'express';
import {
  getMeetings,
  createMeeting,
  updateMeeting,
  deleteMeeting,
} from '../controllers/meetingController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();
router.use(protect);

router.route('/').get(getMeetings).post(createMeeting);
router.route('/:id').put(updateMeeting).delete(deleteMeeting);

export default router;
