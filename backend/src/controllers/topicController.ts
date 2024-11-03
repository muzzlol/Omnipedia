import { Request, Response } from "express";
import Topic from "../models/Topic";
import Vote from "../models/Vote";
import asyncHandler from "../utils/asyncHandler";
import { AuthRequest } from "../types/AuthRequest";
import User from "../models/User";
import { moderate } from "../utils/moderation";
import { redisClient } from '../config/redisConfig';

export const createTopic = async (req: Request, res: Response) => {
  const { name } = req.body;
  console.log(req.body);
  try {
    const existingTopic = await Topic.findOne({ name });
    if (existingTopic) {
      return res.status(400).json({ message: "Topic already exists" });
    }

    const appropriate = await moderate(name);
    if (!appropriate) {
      return res.status(400).json({ message: "Inappropriate topic name." });
    }

    const topic = new Topic({
      name,
      // Slug and description are handled in the pre-save middleware
      resources: [],
    });

    await topic.save();

    res.status(201).json(topic);
  } catch (error) {
    console.error("Error creating topic:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getTopics = async (req: Request, res: Response) => {
  try {
    const topics = await Topic.find().populate("resources");
    res.status(200).json(topics);
  } catch (error) {
    console.error("Error fetching topics:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateTopic = async (req: Request, res: Response) => {
  const { slug } = req.params;
  const { description } = req.body;
  try {
    const topic = await Topic.findOneAndUpdate(
      { slug },
      { description },
      { new: true }
    );
    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }
    res.status(200).json(topic);
  } catch (error) {
    console.error(`Error updating topic with slug "${slug}":`, error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getTopicBySlug = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { slug } = req.params;
    try {
      // Try to get data from cache
      const cachedData = await redisClient.get(`topic:${slug}`);
      if (cachedData) {
        console.log(`Cache hit for topic: ${slug}`);
        return res.status(200).json(JSON.parse(cachedData));
      }

      // If not in cache, fetch from database
      const topic = await Topic.findOne({ slug })
        .populate({
          path: 'resources',
          populate: { path: 'creator', select: '_id username' },
        });
      if (!topic) {
        return res.status(404).json({ message: 'Topic not found' });
      }

      // Fetch user's bookmarked resources
      const user = await User.findById(req.user?._id).select(
        "bookmarkedResources"
      );

      const userBookmarkedResourceIds =
        user?.bookmarkedResources.map((id) => id.toString()) || [];

      // Fetch Vote counts for each resource, creating Vote documents if they don't exist
      const resourcesWithVotes = await Promise.all(
        topic.resources.map(async (resource: any) => {
          let vote = await Vote.findOne({ resource: resource._id });

          if (!vote) {
            // Create a Vote document if it doesn't exist
            vote = await Vote.create({
              resource: resource._id,
              upvoters: [],
              downvoters: [],
            });
          }
          return {
            ...resource.toObject(),
            upvotes: vote.upvoters.length,
            downvotes: vote.downvoters.length,
            isBookmarked: userBookmarkedResourceIds.includes(
              resource._id.toString()
            ), // **Set isBookmarked flag**
          };
        })
      );

      // Prepare response data
      const responseData = {
        ...topic.toObject(),
        resources: resourcesWithVotes,
      };

      // Store data in cache with expiration
      await redisClient.setEx(`topic:${slug}`, 600, JSON.stringify(responseData));
      console.log(`Cache set for topic: ${slug}`);

      return res.status(200).json(responseData);
    } catch (error) {
      console.error("Error fetching topic:", error);
      res.status(500).json({ message: "Server error while fetching topic" });
    }
  }
);
