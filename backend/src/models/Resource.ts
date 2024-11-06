import mongoose, { Document, Schema } from 'mongoose';

// Interface for the Resource model for TypeScript compiler
export interface IResource extends Document {
  type: string;
  url: string;
  classification: string;
  comprehensiveness: number;
  skillLevel: string;
  topic: mongoose.Types.ObjectId;
  creator: mongoose.Types.ObjectId; // Reference to the User who created the resource
  createdAt: Date; // Timestamp when the resource was created
  // Removed votes field to manage votes via the Vote model
}

// Schema for the Resource model
const ResourceSchema: Schema = new Schema({
  type: { type: String, required: true },
  url: { type: String, required: true },
  classification: { type: String, enum: ['free', 'paid'], required: true },
  comprehensiveness: { type: Number, min: 1, max: 100, required: true },
  skillLevel: { type: String, enum: ['beginner', 'intermediary', 'advanced'], required: true },
  topic: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // New field
  createdAt: { type: Date, default: Date.now }, // New field
  // Removed votes field
});

const Resource =  mongoose.model<IResource>('Resource', ResourceSchema);
export default Resource;
