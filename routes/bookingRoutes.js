import express from 'express';
import {
  createBooking,
  getMyBookings,
  cancelBooking,
  getBookedSeats,
} from '../controllers/bookingController.js';
import { protect, attachUser } from '../middleware/auth.js';

const router = express.Router();

// ── Public route (no login required) ─────────────────────
// Anyone viewing the seat layout needs to see which seats are taken
router.get('/:movieId/booked-seats', getBookedSeats);

// ── Protected routes (require login) ──────────────────────
router.use(protect, attachUser);

router.post('/', createBooking);                              // SeatLayout checkout
router.get('/my', getMyBookings);                            // MyBookings page
router.delete('/:id', cancelBooking);                        // Cancel booking

export default router;