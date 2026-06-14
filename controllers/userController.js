import User from '../models/User.js';

// GET /api/users/me
// Returns the currently signed-in user's profile from MongoDB
export const getMe = async (req, res) => {
  try {
    // req.user is set by attachUser middleware
    res.json({ success: true, user: req.user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/users/me/bookings
// Returns all bookings for the current user (populated)
export const getMyBookings = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('bookings');
    res.json({ success: true, bookings: user.bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
