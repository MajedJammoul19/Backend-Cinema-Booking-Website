import express from 'express';
import {
  createBooking,
  getMyBookings,
  cancelBooking,
  getBookedSeats,
} from '../controllers/bookingController.js';
import { protect, attachUser } from '../middleware/auth.js';

const router = express.Router();

// All booking routes require login
router.use(protect, attachUser);

router.post('/', createBooking);                              // SeatLayout checkout
router.get('/my', getMyBookings);                            // MyBookings page
router.delete('/:id', cancelBooking);                        // Cancel booking
router.get('/:movieId/booked-seats', getBookedSeats);        // Block taken seats in SeatLayout

export default router;
