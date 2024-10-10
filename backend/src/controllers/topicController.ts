import { Request, Response } from 'express';
import Topic from '../models/Topic';
import { generateDescription } from '../utils/perplexity';
import { generateResources, ResourceData } from '../utils/perplexity';
import Resource from '../models/Resource';

export const createTopic = async (req: Request, res: Response) => {
  const { name } = req.body;
  try {
    const existingTopic = await Topic.findOne({ name });
    if (existingTopic) {
      return res.status(400).json({ message: 'Topic already exists' });
    }

    const generatedDescription = await generateDescription(name);
    
    // Generate resources using the Perplexity API
    const generatedResources: ResourceData[] = await generateResources(name);

    const topic = new Topic({
      name,
      description: generatedDescription.description,
      resources: [],
    });

    await topic.save();

    res.status(201).json(topic);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getTopics = async (req: Request, res: Response) => {
  try {
    const topics = await Topic.find().populate('resources');
    res.status(200).json(topics);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getTopicById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const topic = await Topic.findById(id).populate('resources');
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }
    res.status(200).json(topic);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateTopic = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { description } = req.body;
  try {
    const topic = await Topic.findByIdAndUpdate(
      id,
      { description },
      { new: true }
    );
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }
    res.status(200).json(topic);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};