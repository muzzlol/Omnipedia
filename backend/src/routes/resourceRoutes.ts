import express from 'express';
import {
  addResource,
  getResources,
  upvoteResource,
  downvoteResource,
  generateResourcesForTopic,
} from '../controllers/resourceController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Routes that require authentication
router.post('/', protect, addResource);
router.get('/', getResources);

// Voting routes
router.put('/:id/upvote', protect, upvoteResource);
router.put('/:id/downvote', protect, downvoteResource);

// Add this new route
router.post('/generate', protect, generateResourcesForTopic);

export default router;
