// backend/config/db.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGO_URI;

const connectDB = async () => {
    try {
      await mongoose.connect(uri as string);
      console.log('MongoDB connected successfully');
    } catch (error) {
      console.error(`Error: ${error.message}`);
      process.exit(1); // Exit process with failure
    }
  };
  

export default connectDB;


