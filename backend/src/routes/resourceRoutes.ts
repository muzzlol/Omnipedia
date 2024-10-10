import express from 'express';
import { addResource, getResources, voteResource } from '../controllers/resourceController';

const router = express.Router();

// Ensure routes are protected by authMiddleware if needed
// Since authMiddleware is applied globally after /auth routes, no need to add here

router.post('/', addResource);
router.get('/', getResources);
router.post('/:id/vote', voteResource);

export default router;