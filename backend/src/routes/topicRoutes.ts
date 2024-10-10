import express from 'express';
import { createTopic, getTopics, getTopicById, updateTopic } from '../controllers/topicController';

const router = express.Router();

router.post('/', createTopic as any);
router.get('/', getTopics);
router.get('/:id', getTopicById as any);
router.put('/:id', updateTopic as any);

export default router;