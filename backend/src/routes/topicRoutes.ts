import express from 'express';
import { createTopic, getTopics, getTopicBySlug, updateTopic } from '../controllers/topicController';

const router = express.Router();

router.post('/', createTopic);
router.get('/', getTopics);
router.get('/:slug', getTopicBySlug); // Fetch topic by slug with vote counts
router.put('/:slug', updateTopic);

export default router;
