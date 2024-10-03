// backend/models/Resource.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IResource extends Document {
  title: string;
  url: string;
  upvotes: number;
  downvotes: number;
  submittedBy: mongoose.Types.ObjectId;
  topic: mongoose.Types.ObjectId;
}

const ResourceSchema: Schema = new Schema(
    {
        title: { 
            type: String, 
            required: true 
        },
        url: { 
            type: String, 
            required: true 
        },
        upvotes: { 
            type: Number, 
            default: 0 
        },
        downvotes: { 
            type: Number, 
            default: 0 
        },
        submittedBy: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User', 
            required: true 
        },
        topic: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Topic', 
            required: true 
        },
});

export default mongoose.model<IResource>('Resource', ResourceSchema);