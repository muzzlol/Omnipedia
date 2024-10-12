import mongoose, { Document, Schema } from 'mongoose';
import slugify from 'slugify';

// Interface for the Topic model for TypeScript compiler
export interface ITopic extends Document {
  name: string;
  slug: string; // New field for URL-friendly name
  description: string;
  resources: mongoose.Types.ObjectId[];
}

// Schema for the Topic model
const TopicSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true }, // Ensure uniqueness
  description: { type: String, required: true },
  resources: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Resource' }],
});

// Ensure slug is generated before saving
TopicSchema.pre<ITopic>('save', function (next) {
  if (this.isModified('name') || !this.slug) {
    this.slug = slugify(this.name, {
      lower: true,
      strict: true, // Remove special characters
    });
  }
  next();
});

export default mongoose.model<ITopic>('Topic', TopicSchema);