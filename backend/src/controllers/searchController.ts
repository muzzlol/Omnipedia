import { Request, Response } from 'express';
import Topic, { ITopic } from '../models/Topic';

export const searchTopics = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;

    if (typeof query !== 'string') {
      return res.status(400).json({ message: 'Invalid search query' });
    }

    const topics: ITopic[] = await Topic.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { slug: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    }).select('name description slug').limit(10);

    if (topics.length === 0) {
      return res.json({ message: 'No results found', topics: [] });
    }

    res.json({ topics });
  } catch (error) {
    res.status(500).json({ message: 'Server error during search' });
  }
};