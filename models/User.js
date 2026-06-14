import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    // clerkId is the source of truth — maps to Clerk's user.id
    clerkId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    imageUrl: {
      type: String,
    },
    // For future use: admin panel, etc.
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    // Bookings will be stored in a separate collection; this is a convenience ref
    bookings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
      },
    ],
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

// Virtual: full name helper
userSchema.virtual('fullName').get(function () {
  return `${this.firstName || ''} ${this.lastName || ''}`.trim();
});

const User = mongoose.model('User', userSchema);
export default User;
