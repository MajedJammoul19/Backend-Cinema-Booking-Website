import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    // Link to our MongoDB user
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Clerk user id for quick lookup without populate
    clerkId: {
      type: String,
      required: true,
      index: true,
    },
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: true,
    },
    // Snapshot of movie info so booking stays valid even if movie changes
    movieSnapshot: {
      title: String,
      poster_path: String,
      runtime: Number,
    },
    show: {
      date: { type: String, required: true },       // "2025-01-15"
      time: { type: String, required: true },       // ISO time string
      formattedTime: { type: String },              // "2:00 PM"
      showId: { type: String },
    },
    bookedSeats: {
      type: [String], // e.g. ["A1", "A2", "B3"]
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    isPaid: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ['confirmed', 'cancelled', 'pending'],
      default: 'confirmed',
    },
    bookingId: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);

// Auto-generate bookingId before saving
bookingSchema.pre('save', function (next) {
  if (!this.bookingId) {
    this.bookingId = `BK${Date.now()}`;
  }
  next();
});

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
