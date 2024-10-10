import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined in the environment variables');
  }

  try {
    await mongoose.connect(MONGODB_URI);
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err; // Re-throw the error to be handled by the caller
  }
};

export default connectDB;