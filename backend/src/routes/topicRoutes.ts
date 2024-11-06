import express from "express";
import {
  createTopic,
  getTopics,
  getTopicBySlug,
  updateTopic,
  getUserTopicFlags,
} from "../controllers/topicController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.post('/', protect, createTopic);
router.get('/', protect, getTopics);
router.get('/:slug', protect, getTopicBySlug);
router.put('/:slug', protect, updateTopic);
router.get('/:slug/flags', protect, getUserTopicFlags);


export default router;
