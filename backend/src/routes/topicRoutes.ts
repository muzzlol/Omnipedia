import express from 'express';
import { createTopic, getTopics, getTopicBySlug, updateTopic } from '../controllers/topicController';

const router = express.Router();

router.post('/', createTopic as any);
router.get('/', getTopics);
router.get('/:slug', getTopicBySlug); // Fetch topic by slug
router.put('/:slug', updateTopic as any);

export default router;