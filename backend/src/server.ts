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

dotenv.config();

const app = express();

// CORS middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

// Middleware to parse JSON bodies in requests
app.use(express.json());

// Connect to MongoDB and start the server
const startServer = async () => {
  try {
    await connectDB();
    console.log('MongoDB connected');
    // Start the server only after connecting to the database
    const PORT = process.env.PORT || 5001;
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
app.use(errorHandler); // Note : I don't know if this works or is needed

// Add this near your other routes
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working' });
});

startServer();