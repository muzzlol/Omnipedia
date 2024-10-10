import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';


// Interface for the User model for TypeScript compiler
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  bookmarkedResources: mongoose.Types.ObjectId[];
  followedUsers: mongoose.Types.ObjectId[];
}

// Schema for the User model
const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bookmarkedResources: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Resource' }],
  followedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

// Middleware to hash the password before saving the user
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password as string, salt);
    return next();
  } catch (error) {
    return next(error as Error);
  }
});
// The following has been implemented in the authController.ts file directly in the login function ez.
// UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
//   return bcrypt.compare(candidatePassword, this.password);
// };

export default mongoose.model<IUser>('User', UserSchema);