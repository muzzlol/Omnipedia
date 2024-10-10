import { Request, Response } from 'express';
import Resource from '../models/Resource';
import asyncHandler from '../middleware/asyncHandler';

export const addResource = asyncHandler(async (req: Request, res: Response) => {
  const { type, url, classification, comprehensiveness, skillLevel, topicId } = req.body;
  const resource = new Resource({
    type,
    url,
    classification,
    comprehensiveness,
    skillLevel,
    topic: topicId,
  });
  await resource.save();
  res.status(201).json(resource);
});

export const getResources = asyncHandler(async (req: Request, res: Response) => {
  const resources = await Resource.find().populate('topic');
  res.status(200).json(resources);
});

export const voteResource = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const resource = await Resource.findById(id);
  if (!resource) {
    res.status(404).json({ message: 'Resource not found' });
    return;
  }
  resource.votes += 1;
  await resource.save();
  res.status(200).json(resource);
});