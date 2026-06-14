import express from 'express';
import {
  getAllMovies,
  getFeaturedMovies,
  getMovieById,
  getShowtimesByDate,
  createMovie,
  updateMovie,
  deleteMovie,
} from '../controllers/movieController.js';
import { protect, attachUser, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// ── Public routes (no login needed) ──────────────────────
router.get('/', getAllMovies);
router.get('/featured', getFeaturedMovies);
router.get('/:id', getMovieById);
router.get('/:id/showtimes/:date', getShowtimesByDate);

// ── Admin only routes ─────────────────────────────────────
router.post('/', protect, attachUser, adminOnly, createMovie);
router.put('/:id', protect, attachUser, adminOnly, updateMovie);
router.delete('/:id', protect, attachUser, adminOnly, deleteMovie);

export default router;
