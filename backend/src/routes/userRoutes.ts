import express from 'express';
import { getProfile, updateProfile, bookmarkResource, followUser, unbookmarkResource, getUserProfile } from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/profile', protect, getProfile); 
router.put('/profile', protect, updateProfile); 
router.post('/bookmark', protect, bookmarkResource);
router.post('/follow', protect, followUser); 
router.post('/unbookmark', protect, unbookmarkResource);

// Public profile route
router.get('/:userId', getUserProfile);

export default router;
