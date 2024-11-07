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
router.get('/', getTopics);
router.get('/:slug', getTopicBySlug);
router.get('/:slug/flags', protect, getUserTopicFlags);
router.put('/:slug', protect, updateTopic);


export default router;
