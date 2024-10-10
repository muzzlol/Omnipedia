import express from 'express';
import authRoutes from './routes/authRoutes';
import * as dotenv from 'dotenv';
import authMiddleware from './middleware/authMiddleware';
import connectDB from './config/db';
import topicRoutes from './routes/topicRoutes';
import resourceRoutes from './routes/resourceRoutes';
import userRoutes from './routes/userRoutes';
import errorHandler from './middleware/errorHandler';

// Load environment variables from .env file into process.env
dotenv.config();

const app = express();

// Middleware to parse JSON bodies in requests
app.use(express.json());

// Connect to MongoDB and start the server
const startServer = async () => {
  try {
    await connectDB();
    console.log('MongoDB connected');
    // Start the server only after connecting to the database
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1); // Exit all processes if database connection fails or server fails to start
  }
};

// Routes
app.use('/auth', authRoutes);

app.use('/topics', topicRoutes);

// Apply authMiddleware to routes that require authentication
// Note: This should be placed after public routes and before protected routes
app.use(authMiddleware);

// Add the following routes after authMiddleware
app.use('/resources', resourceRoutes);
app.use('/users', userRoutes);

// Global Error Handler (place after all other middleware and routes)
app.use(errorHandler);

startServer();