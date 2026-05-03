import express from 'express';
import { getUsers, updateProfile, getAnalytics } from '../controllers/user.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getUsers);
router.put('/me', updateProfile);
router.get('/analytics', getAnalytics);

export default router;
