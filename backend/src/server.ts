import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import topicRoutes from './routes/topicRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import resourceRoutes from './routes/resourceRoutes.js';
import errorHandler from './middleware/errorHandler.js';
import authMiddleware from './middleware/authMiddleware.js';
import searchRoutes from './routes/searchRoutes.js';

dotenv.config();

const app = express();

// CORS middleware
app.use(cors({
  origin: 'http://localhost:5173', // konect to port runningfrontend
  credentials: true,
}));

// Middleware to parse JSON bodies in requests
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/search', searchRoutes);
app.use('/topics', topicRoutes);

// Apply authMiddleware to routes that require authentication
app.use(authMiddleware);

app.use('/resources', resourceRoutes);
app.use('/users', userRoutes);

// Global Error Handler
app.use(errorHandler);

// Connect to MongoDB and start the server
const startServer = async () => {
  try {
    await connectDB();
    console.log('MongoDB connected');
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();