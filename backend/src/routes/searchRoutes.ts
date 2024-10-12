import express from 'express';
import { searchTopics } from '../controllers/searchController';

const router = express.Router();

router.get('/topics', searchTopics);

export default router;