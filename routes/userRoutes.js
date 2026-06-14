import express from 'express';
import { protect, attachUser } from '../middleware/auth.js';
import { getMe, getMyBookings } from '../controllers/userController.js';

const router = express.Router();

// All user routes require a valid Clerk session
router.use(protect, attachUser);

router.get('/me', getMe);
router.get('/me/bookings', getMyBookings);

export default router;
