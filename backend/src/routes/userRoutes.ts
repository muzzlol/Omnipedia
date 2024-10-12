import express from 'express';
import { getProfile, updateProfile, bookmarkResource, followUser } from '../controllers/userController';
import { protect } from '../middleware/authMiddleware'; // Updated import

const router = express.Router();

router.get('/profile', protect, getProfile); // Protected route
router.put('/profile', protect, updateProfile); // Protected route
router.post('/bookmark', protect, bookmarkResource); // Protected route
router.post('/follow', protect, followUser); // Protected route

export default router;
