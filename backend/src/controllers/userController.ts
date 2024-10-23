import { Response } from 'express';
import User from '../models/User';
import asyncHandler from '../utils/asyncHandler';
import { AuthRequest } from '../types/AuthRequest';


// Get any user's profile by ID
export const getUserProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  try {
    console.log('Fetching user profile for ID:', req.params.userId);
    
    const user = await User.findById(req.params.userId)
      .populate({
        path: 'bookmarkedResources',
        populate: { path: 'topic', select: 'name' }
      })
      .populate('followedUsers', 'username email')
      .populate('followers', 'username email')
      .populate({
        path: 'resources',
        populate: { 
          path: 'topic',
          select: 'name'
        },
        select: 'url classification comprehensiveness skillLevel topic'
      });

    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('User resources:', user.resources);
    
    res.status(200).json(user);
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    res.status(500).json({ message: 'Server error while fetching user profile' });
  }
});

// Update user profile - only allow avatarUrl changes
export const updateProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { avatarUrl } = req.body;
  
  try {
    if (!avatarUrl) {
      return res.status(400).json({ message: 'Avatar URL is required' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user?._id,
      { $set: { avatarUrl } },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error while updating profile' });
  }
});

// Bookmark a resource
export const bookmarkResource = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { resourceId } = req.body;

  if (!resourceId) {
    return res.status(400).json({ message: 'Resource ID is required' });
  }

  try {
    const user = await User.findById(req.user?._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.bookmarkedResources.includes(resourceId)) {
      user.bookmarkedResources.push(resourceId);
      await user.save();
    }

    res.status(200).json(user.bookmarkedResources);
  } catch (error) {
    console.error('Error bookmarking resource:', error);
    res.status(500).json({ message: 'Server error while bookmarking resource' });
  }
});

// Unbookmark a resource
export const unbookmarkResource = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { resourceId } = req.body;

  if (!resourceId) {
    return res.status(400).json({ message: 'Resource ID is required' });
  }

  try {
    const user = await User.findById(req.user?._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.bookmarkedResources.includes(resourceId)) {
      user.bookmarkedResources = user.bookmarkedResources.filter(
        (id) => id.toString() !== resourceId
      );
      await user.save();
    }

    res.status(200).json(user.bookmarkedResources);
  } catch (error) {
    console.error('Error unbookmarking resource:', error);
    res.status(500).json({ message: 'Server error while unbookmarking resource' });
  }
});

// Follow a user
export const followUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { userIdToFollow } = req.body;
  const currentUserId = req.user?._id;

  if (!userIdToFollow) {
    return res.status(400).json({ message: 'User ID to follow is required' });
  }

  if (userIdToFollow === currentUserId?.toString()) {
    return res.status(400).json({ message: 'You cannot follow yourself' });
  }

  try {
    const userToFollow = await User.findById(userIdToFollow);
    if (!userToFollow) {
      return res.status(404).json({ message: 'User to follow not found' });
    }

    // Add to current user's followedUsers if not already present
    if (!req.user?.followedUsers.includes(userIdToFollow)) {
      req.user?.followedUsers.push(userIdToFollow);
      await req.user?.save();
    }

    // Add current user to the followed user's followers
    if (!userToFollow.followers.includes(currentUserId as any)) {
      userToFollow.followers.push(currentUserId as any);
      await userToFollow.save();
    }

    res.status(200).json({
      followedUsers: req.user?.followedUsers,
      followers: userToFollow.followers,
    });
  } catch (error) {
    console.error('Error following user:', error);
    res.status(500).json({ message: 'Server error while following user' });
  }
});

// Unfollow a user
export const unfollowUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { userIdToUnfollow } = req.body;
  const currentUserId = req.user?._id;

  if (!userIdToUnfollow) {
    return res.status(400).json({ message: 'User ID to unfollow is required' });
  }

  if (userIdToUnfollow === currentUserId?.toString()) {
    return res.status(400).json({ message: 'You cannot unfollow yourself' });
  }

  try {
    const userToUnfollow = await User.findById(userIdToUnfollow);
    if (!userToUnfollow) {
      return res.status(404).json({ message: 'User to unfollow not found' });
    }

    // Remove from current user's followedUsers if present
    if (req.user?.followedUsers.includes(userIdToUnfollow)) {
      req.user!.followedUsers = req.user!.followedUsers.filter(
        (id) => id.toString() !== userIdToUnfollow
      );
      await req.user?.save();
    }

    // Remove current user from the followed user's followers
    if (userToUnfollow.followers.includes(currentUserId as any)) {
      userToUnfollow.followers = userToUnfollow.followers.filter(
        (id) => id.toString() !== currentUserId?.toString()
      );
      await userToUnfollow.save();
    }

    res.status(200).json({
      followedUsers: req.user?.followedUsers,
      followers: userToUnfollow.followers,
    });
  } catch (error) {
    console.error('Error unfollowing user:', error);
    res.status(500).json({ message: 'Server error while unfollowing user' });
  }
});

// Get user profile with all relevant populated fields
export const getProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  try {
    console.log('Fetching profile for user:', req.user?._id);
    
    const user = await User.findById(req.user?._id)
      .populate({
        path: 'bookmarkedResources',
        populate: { path: 'topic', select: 'name' }
      })
      .populate('followedUsers', 'username email')
      .populate('followers', 'username email')
      .populate({
        path: 'resources',
        populate: { 
          path: 'topic',
          select: 'name'
        },
        select: 'url classification comprehensiveness skillLevel topic'
      });

    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('User resources:', user.resources);

    res.status(200).json(user);
  } catch (error) {
    console.error('Error in getProfile:', error);
    res.status(500).json({ message: 'Server error while fetching profile' });
  }
});
