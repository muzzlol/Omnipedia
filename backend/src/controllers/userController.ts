import { Request, Response } from 'express';
import User from '../models/User';

interface AuthRequest extends Request {
  user?: any;
}

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('bookmarkedResources')
      .populate('followedUsers');
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateProfile = async (req: AuthRequest & { body: any }, res: Response) => {
  const { username } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { username },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const bookmarkResource = async (req: AuthRequest & { body: any }, res: Response) => {
  const { resourceId } = req.body;
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (!user.bookmarkedResources.includes(resourceId)) {
      user.bookmarkedResources.push(resourceId);
      await user.save();
    }
    res.status(200).json(user.bookmarkedResources);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const followUser = async (req: AuthRequest & { body: any }, res: Response) => {
  const { userIdToFollow } = req.body;
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (!user.followedUsers.includes(userIdToFollow)) {
      user.followedUsers.push(userIdToFollow);
      await user.save();
    }
    res.status(200).json(user.followedUsers);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


