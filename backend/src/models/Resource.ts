import mongoose, { Document, Schema } from 'mongoose';

export interface IResource extends Document {
  type: string;
  url: string;
  classification: string;
  comprehensiveness: number;
  skillLevel: string;
  topic: mongoose.Types.ObjectId;
  votes: number;
}

const ResourceSchema: Schema = new Schema({
  type: { type: String, required: true },
  url: { type: String, required: true },
  classification: { type: String, enum: ['free', 'paid'], required: true },
  comprehensiveness: { type: Number, min: 1, max: 100, required: true },
  skillLevel: { type: String, enum: ['beginner', 'intermediary', 'advanced'], required: true },
  topic: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', required: true },
  votes: { type: Number, default: 0 },
});

export default mongoose.model<IResource>('Resource', ResourceSchema);