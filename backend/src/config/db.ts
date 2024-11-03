import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  const mongodbUri: string | undefined = process.env.MONGODB_URI;

  if (!mongodbUri) {
    throw new Error('MONGODB_URI is not defined in the environment variables');
  }

  try {
    await mongoose.connect(mongodbUri);
    console.log(`MongoDB connected successfully. Connected to database: ${mongoose.connection.name}`);
  } catch (err: any) {
    console.error('MongoDB connection error:', err.message, 'Full error:', err);
    throw err;
  }
};

export default connectDB;