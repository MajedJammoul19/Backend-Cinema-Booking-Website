// routes/adminRoutes.js
import express from 'express';
import { protect, attachUser, adminOnly } from '../middleware/auth.js';
import { createMovie, updateMovie, deleteMovie, getAllMoviesAdmin } from '../controllers/movieController.js';
import { getAllBookings } from '../controllers/bookingController.js';
import { getAllUsers, updateUserRole } from '../controllers/userController.js';

const router = express.Router();

// Every route below requires: signed in + synced user + admin role
router.use(protect, attachUser, adminOnly);

router.get('/movies', getAllMoviesAdmin);
router.post('/movies', createMovie);
router.put('/movies/:id', updateMovie);
router.delete('/movies/:id', deleteMovie);

router.get('/bookings', getAllBookings);

router.get('/users', getAllUsers);
router.patch('/users/:id/role', updateUserRole);

export default router;