import express from 'express';
import { getProfile, updateProfile, bookmarkResource, followUser } from '../controllers/userController';

const router = express.Router();

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.post('/bookmark', bookmarkResource as any);
router.post('/follow', followUser as any);

export default router;