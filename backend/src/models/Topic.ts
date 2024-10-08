import mongoose, { Document, Schema } from 'mongoose';

export interface ITopic extends Document {
  name: string;
  description: string;
  resources: mongoose.Types.ObjectId[];
}

const TopicSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  resources: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Resource' }],
});

export default mongoose.model<ITopic>('Topic', TopicSchema);