import express from "express";
import {
  createTopic,
  getTopics,
  getTopicBySlug,
  updateTopic,
} from "../controllers/topicController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.post('/', createTopic);
router.get('/', getTopics);
router.get('/:slug', getTopicBySlug); 
router.put('/:slug', updateTopic);


export default router;
