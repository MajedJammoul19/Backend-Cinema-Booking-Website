import Movie from '../models/Movie.js';

// GET /api/movies
// Returns all now-showing movies (used in Movies.jsx)
export const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find({ isNowShowing: true }).select('-dateTime');
    res.json({ success: true, movies });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/movies/featured
// Returns featured movies (used in HeroSection / FeaturedSection)
export const getFeaturedMovies = async (req, res) => {
  try {
    const movies = await Movie.find({ isFeatured: true }).select('-dateTime');
    res.json({ success: true, movies });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/movies/:id
// Returns single movie with full details + dateTime (used in MovieDetails.jsx)
export const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }
    res.json({ success: true, movie });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/movies/:id/showtimes/:date
// Returns available showtimes for a specific date (used in SeatLayout.jsx)
export const getShowtimesByDate = async (req, res) => {
  try {
    const { id, date } = req.params;
    const movie = await Movie.findById(id).select('dateTime title');

    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }

    const timings = movie.dateTime.get(date) || [];
    res.json({ success: true, timings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Admin only ────────────────────────────────────────────

// POST /api/movies
export const createMovie = async (req, res) => {
  try {
    const movie = await Movie.create(req.body);
    res.status(201).json({ success: true, movie });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT /api/movies/:id
export const updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!movie) return res.status(404).json({ success: false, message: 'Movie not found' });
    res.json({ success: true, movie });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /api/movies/:id
export const deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) return res.status(404).json({ success: false, message: 'Movie not found' });
    res.json({ success: true, message: 'Movie deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getAllMoviesAdmin = async (req, res) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 });
    res.json({ success: true, movies });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};