import express from 'express';
import { Webhook } from 'svix';
import User from '../models/User.js';

const router = express.Router();

// POST /api/webhooks/clerk
// Clerk calls this endpoint on user.created / user.updated / user.deleted
// Must be registered in Clerk Dashboard → Webhooks
router.post(
  '/clerk',
  express.raw({ type: 'application/json' }), // svix needs raw body
  async (req, res) => {
    const secret = process.env.CLERK_WEBHOOK_SECRET;

    if (!secret) {
      console.error('CLERK_WEBHOOK_SECRET not set');
      return res.status(500).json({ message: 'Webhook secret not configured' });
    }

    // Verify the webhook signature with svix
    const wh = new Webhook(secret);
    let evt;

    try {
      evt = wh.verify(req.body, {
        'svix-id': req.headers['svix-id'],
        'svix-timestamp': req.headers['svix-timestamp'],
        'svix-signature': req.headers['svix-signature'],
      });
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).json({ message: 'Invalid signature' });
    }

    const { type, data } = evt;
    console.log(`📨 Clerk webhook: ${type}`);

    try {
      switch (type) {
        case 'user.created': {
          await User.findOneAndUpdate(
            { clerkId: data.id },
            {
              clerkId: data.id,
              email: data.email_addresses[0]?.email_address,
              firstName: data.first_name,
              lastName: data.last_name,
              imageUrl: data.image_url,
            },
            { upsert: true, new: true }
          );
          console.log(`✅ user.created synced: ${data.id}`);
          break;
        }

        case 'user.updated': {
          await User.findOneAndUpdate(
            { clerkId: data.id },
            {
              email: data.email_addresses[0]?.email_address,
              firstName: data.first_name,
              lastName: data.last_name,
              imageUrl: data.image_url,
            }
          );
          console.log(`✅ user.updated synced: ${data.id}`);
          break;
        }

        case 'user.deleted': {
          await User.findOneAndDelete({ clerkId: data.id });
          console.log(`🗑️  user.deleted removed: ${data.id}`);
          break;
        }

        default:
          console.log(`⚠️  Unhandled webhook type: ${type}`);
      }

      res.json({ success: true });
    } catch (error) {
      console.error('Webhook handler error:', error);
      res.status(500).json({ message: 'Webhook processing failed' });
    }
  }
);

export default router;
