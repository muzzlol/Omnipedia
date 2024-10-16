import express from 'express';
import { upvoteResource, downvoteResource, getUpvoters, getDownvoters } from '../controllers/resourceController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Upvote a resource
router.post('/upvote/:id', protect, upvoteResource);

// Downvote a resource
router.post('/downvote/:id', protect, downvoteResource);

// Get upvoters for a resource
router.get('/:id/upvoters', protect, getUpvoters);

// Get downvoters for a resource
router.get('/:id/downvoters', protect, getDownvoters);

export default router;
