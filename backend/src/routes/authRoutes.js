import { Router } from 'express';
import {
  registerUser,
  loginUser,
  getMe,
  getPreferences,
  updatePreferences,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.get('/preferences', protect, getPreferences);
router.put('/preferences', protect, updatePreferences);

export default router;
