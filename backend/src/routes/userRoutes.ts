import express from 'express';
import { getProfile, updateProfile, bookmarkResource, followUser, unbookmarkResource, getUserProfile } from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Add logging middleware
router.use((req, res, next) => {
  console.log(`User Route accessed: ${req.method} ${req.originalUrl}`);
  next();
});

router.get('/profile', protect, getProfile); 
router.put('/profile', protect, updateProfile); 
router.post('/bookmark', protect, bookmarkResource);
router.post('/follow', protect, followUser); 
router.post('/unbookmark', protect, unbookmarkResource);

// Public profile route
router.get('/:userId', getUserProfile);

export default router;
