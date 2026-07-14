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

// GET /api/admin/users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-bookings').sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/admin/users/:id/role
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }
    // stop an admin from locking themselves out
    if (req.params.id === req.user._id.toString() && role !== 'admin') {
      return res.status(400).json({ success: false, message: "You can't remove your own admin access" });
    }
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};