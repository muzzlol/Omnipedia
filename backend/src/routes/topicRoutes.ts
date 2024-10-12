import express from 'express';
import { createTopic, getTopics, getTopicByName, updateTopic } from '../controllers/topicController';

const router = express.Router();

router.post('/', createTopic as any);
router.get('/', getTopics);
router.get('/:name', getTopicByName);
router.put('/:name', updateTopic as any);

export default router;
