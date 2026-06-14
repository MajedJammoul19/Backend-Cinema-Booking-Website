import { clerkClient, requireAuth } from '@clerk/express';
import User from '../models/User.js';

// ─── Protect route: must be signed in via Clerk ───────────
// Attaches auth.userId to req if valid, else returns 401
export const protect = requireAuth();

// ─── Sync + attach full user doc from MongoDB ─────────────
// Use AFTER protect. Finds or creates a MongoDB user from
// the Clerk session, then attaches it to req.user.
export const attachUser = async (req, res, next) => {
  try {
    const { userId } = req.auth; // set by requireAuth()

    // Try to find existing user
    let user = await User.findOne({ clerkId: userId });

    if (!user) {
      // First time this Clerk user hits our backend — fetch their profile and create a doc
      const clerkUser = await clerkClient.users.getUser(userId);

      user = await User.create({
        clerkId: userId,
        email: clerkUser.emailAddresses[0]?.emailAddress,
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
        imageUrl: clerkUser.imageUrl,
      });

      console.log(`👤 New user synced from Clerk: ${user.email}`);
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('attachUser error:', error);
    res.status(500).json({ message: 'Failed to load user profile' });
  }
};

// ─── Admin only ───────────────────────────────────────────
// Use after attachUser
export const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};
