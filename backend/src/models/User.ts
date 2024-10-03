// backend/models/User.ts
import mongoose, { Schema, Document } from 'mongoose';

// Define an interface representing a document in MongoDB.
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  bookmarks: mongoose.Types.ObjectId[];
  friends: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

// Create a Schema corresponding to the document interface.
const UserSchema: Schema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    //TODO: Figure logic behind getting saved bookmarks and added friends
    bookmarks: [
      {
        type: mongoose.Schema.Types.ObjectId, ref: 'Resource',
      },
    ],
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId, ref: 'User',
      },
    ],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create and export the model.
export default mongoose.model<IUser>('User', UserSchema);
