import mongoose, { Document, Schema } from 'mongoose';

// Interface for the Vote model for TypeScript compiler
export interface IVote extends Document {
  resource: mongoose.Types.ObjectId;
  upvoters: mongoose.Types.ObjectId[];
  downvoters: mongoose.Types.ObjectId[];
}

// Schema for the Vote model
const VoteSchema: Schema = new Schema({
  resource: { type: mongoose.Schema.Types.ObjectId, ref: 'Resource', required: true, unique: true },
  upvoters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  downvoters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

export default mongoose.model<IVote>('Vote', VoteSchema);
