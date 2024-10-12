import mongoose, { Document, Schema } from 'mongoose';

// Interface for the User model for TypeScript compiler
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  bookmarkedResources: mongoose.Types.ObjectId[];
  followedUsers: mongoose.Types.ObjectId[];
  followers: mongoose.Types.ObjectId[];
  resources: mongoose.Types.ObjectId[];
  isAdmin: boolean;
}

// Schema for the User model
const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bookmarkedResources: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Resource' }],
  followedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  resources: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Resource' }],
  isAdmin: { type: Boolean, default: false },
});

export default mongoose.model<IUser>('User', UserSchema);
