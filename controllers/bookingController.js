import Booking from '../models/Booking.js';
import Movie from '../models/Movie.js';
import User from '../models/User.js';

// POST /api/bookings
// Called when user clicks "Proceed to Checkout" in SeatLayout.jsx
export const createBooking = async (req, res) => {
  try {
    const { movieId, show, bookedSeats, amount } = req.body;

    // Validate movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }

    // Check seats are not already booked for this show
    const existingBooking = await Booking.findOne({
      movie: movieId,
      'show.date': show.date,
      'show.time': show.time,
      status: { $ne: 'cancelled' },
      bookedSeats: { $in: bookedSeats },
    });

    if (existingBooking) {
      const takenSeats = existingBooking.bookedSeats.filter(s => bookedSeats.includes(s));
      return res.status(409).json({
        success: false,
        message: `Seats already booked: ${takenSeats.join(', ')}`,
      });
    }

    // Create booking
    const booking = await Booking.create({
      user: req.user._id,
      clerkId: req.user.clerkId,
      movie: movieId,
      movieSnapshot: {
        title: movie.title,
        poster_path: movie.poster_path,
        runtime: movie.runtime,
      },
      show,
      bookedSeats,
      amount,
      isPaid: true,
      status: 'confirmed',
    });

    // Add booking ref to user doc
    await User.findByIdAndUpdate(req.user._id, {
      $push: { bookings: booking._id },
    });

    res.status(201).json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/bookings/my
// Returns all bookings for the logged-in user (used in MyBookings.jsx)
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      clerkId: req.user.clerkId,
      status: { $ne: 'cancelled' },
    })
      .populate('movie', 'title poster_path runtime')
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/bookings/:id
// Cancel a booking (used in MyBookings.jsx cancel button)
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      clerkId: req.user.clerkId, // ensure user owns this booking
    });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Booking already cancelled' });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({ success: true, message: 'Booking cancelled successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/bookings/:movieId/booked-seats?date=&time=
// Returns already booked seats for a show so SeatLayout can mark them as unavailable
export const getBookedSeats = async (req, res) => {
  try {
    const { movieId } = req.params;
    const { date, time } = req.query;

    const bookings = await Booking.find({
      movie: movieId,
      'show.date': date,
      'show.time': time,
      status: { $ne: 'cancelled' },
    }).select('bookedSeats');

    const bookedSeats = bookings.flatMap(b => b.bookedSeats);
    res.json({ success: true, bookedSeats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// GET /api/admin/bookings — every booking, with user + movie info
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('movie', 'title poster_path')
      .populate('user', 'firstName lastName email')
      .sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};