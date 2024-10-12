import { Request, Response } from 'express';
import Resource from '../models/Resource';
import asyncHandler from '../utils/asyncHandler';
import Vote from '../models/Vote';
import User from '../models/User';
import { AuthRequest } from '../types/AuthRequest';

// Add a new resource
export const addResource = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { type, url, classification, comprehensiveness, skillLevel, topicId } = req.body;

  // Validate input fields
  if (!type || !url || !classification || typeof comprehensiveness !== 'number' || !skillLevel || !topicId) {
    return res.status(400).json({ message: 'All fields are required and must be valid' });
  }

  try {
    // Create new resource and associate with creator
    const resource = new Resource({
      type,
      url,
      classification,
      comprehensiveness,
      skillLevel,
      topic: topicId,
      creator: req.user?._id,
    });

    await resource.save();

    // Initialize Vote document for the new resource
    const vote = new Vote({
      resource: resource._id,
      upvoters: [],
      downvoters: [],
    });

    await vote.save();

    // Add resource to the user's resources array
    await User.findByIdAndUpdate(req.user?._id, { $push: { resources: resource._id } });

    res.status(201).json(resource);
  } catch (error) {
    console.error('Error adding resource:', error);
    res.status(500).json({ message: 'Server error while adding resource' });
  }
});

// Get all resources with populated topic and creator
export const getResources = asyncHandler(async (req: Request, res: Response) => {
  try {
    const resources = await Resource.find()
      .populate('topic')
      .populate('creator', 'username email'); // Populate creator's username and email

    // Include vote counts
    const resourcesWithVotes = await Promise.all(resources.map(async resource => {
      const vote = await Vote.findOne({ resource: resource._id });
      return {
        ...resource.toObject(),
        upvotes: vote?.upvoters.length || 0,
        downvotes: vote?.downvoters.length || 0,
      };
    }));

    res.status(200).json(resourcesWithVotes);
  } catch (error) {
    console.error('Error fetching resources:', error);
    res.status(500).json({ message: 'Server error while fetching resources' });
  }
});

// Upvote a resource
export const upvoteResource = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user?._id;

  try {
    const vote = await Vote.findOne({ resource: id });
    if (!vote) {
      return res.status(404).json({ message: 'Vote record not found for this resource' });
    }

    // Prevent duplicate upvotes
    if (vote.upvoters.includes(userId as any)) {
      return res.status(400).json({ message: 'You have already upvoted this resource' });
    }

    // Remove user from downvoters if present
    vote.downvoters = vote.downvoters.filter(uid => uid.toString() !== userId?.toString());

    // Add user to upvoters
    vote.upvoters.push(userId as any);

    await vote.save();

    res.status(200).json({ upvotes: vote.upvoters.length, downvotes: vote.downvoters.length });
  } catch (error) {
    console.error('Error upvoting resource:', error);
    res.status(500).json({ message: 'Server error while upvoting resource' });
  }
});

// Downvote a resource
export const downvoteResource = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user?._id;

  try {
    const vote = await Vote.findOne({ resource: id });
    if (!vote) {
      return res.status(404).json({ message: 'Vote record not found for this resource' });
    }

    // Prevent duplicate downvotes
    if (vote.downvoters.includes(userId as any)) {
      return res.status(400).json({ message: 'You have already downvoted this resource' });
    }

    // Remove user from upvoters if present
    vote.upvoters = vote.upvoters.filter(uid => uid.toString() !== userId?.toString());

    // Add user to downvoters
    vote.downvoters.push(userId as any);

    await vote.save();

    res.status(200).json({ upvotes: vote.upvoters.length, downvotes: vote.downvoters.length });
  } catch (error) {
    console.error('Error downvoting resource:', error);
    res.status(500).json({ message: 'Server error while downvoting resource' });
  }
});