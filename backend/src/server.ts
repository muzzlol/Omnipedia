import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import topicRoutes from './routes/topicRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js'; 
import resourceRoutes from './routes/resourceRoutes.js';
import errorHandler from './middleware/errorHandler.js';
import searchRoutes from './routes/searchRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import voteRoutes from './routes/voteRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// CORS middleware
app.use(cors({
  origin: 'http://localhost:5173', // Konnect to frontend
  credentials: true,
}));

// Serve static files from the 'public' directory
app.use('/images', express.static(path.join(__dirname, '..', 'public/images')));

// Middleware to parse JSON bodies in requests
app.use(express.json());

// Routes that don't require authentication
app.use('/auth', authRoutes);
app.use('/search', searchRoutes);
app.use('/topics', topicRoutes);

// Routes that require authentication
app.use('/vote', voteRoutes);
app.use('/resources', resourceRoutes);
app.use('/users', userRoutes);

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to connect to the database', err);
  process.exit(1);
});
