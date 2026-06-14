import mongoose from 'mongoose';

const castSchema = new mongoose.Schema({
  name: String,
  profile_path: String,
});

const genreSchema = new mongoose.Schema({
  id: Number,
  name: String,
});

const showTimeSchema = new mongoose.Schema({
  time: String, // ISO string e.g. "2025-01-15T14:00:00.000Z"
  showId: String,
});

const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    overview: { type: String },
    tagline: { type: String },
    poster_path: { type: String },
    backdrop_path: { type: String },
    trailer_url: { type: String },
    vote_average: { type: Number, default: 0 },
    vote_count: { type: Number, default: 0 },
    runtime: { type: Number }, // in minutes
    release_date: { type: String },
    original_language: { type: String, default: 'en' },
    genres: [genreSchema],
    casts: [castSchema],
    // dateTime: { "2025-01-15": [{time, showId}, ...], ... }
    dateTime: {
      type: Map,
      of: [showTimeSchema],
      default: {},
    },
    isNowShowing: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Movie = mongoose.model('Movie', movieSchema);
export default Movie;
