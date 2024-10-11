import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined in the environment variables');
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected successfully');
    console.log('Connected to database:', mongoose.connection.name);
  } catch (err: any) {
    console.error('MongoDB connection error:', err.message);
    console.error('Full error:', err);
    throw err;
  }
};

export default connectDB;