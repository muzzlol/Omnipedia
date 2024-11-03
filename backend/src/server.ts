import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import connectRedis from "./config/redisConfig";
import topicRoutes from "./routes/topicRoutes";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import resourceRoutes from "./routes/resourceRoutes";
import errorHandler from "./middleware/errorHandler";
import searchRoutes from "./routes/searchRoutes";
import voteRoutes from "./routes/voteRoutes";

dotenv.config();

const app = express();

// CORS middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
    ], // Konnect to frontend
    credentials: true,
  })
);

// Middleware to parse JSON bodies in requests
app.use(express.json());

// Routes that don't require authentication
app.use("/auth", authRoutes);
app.use("/search", searchRoutes);
app.use("/topics", topicRoutes);

// Routes that require authentication
app.use("/vote", voteRoutes);
app.use("/resources", resourceRoutes);
app.use("/users", userRoutes);

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

// Initialize connections and start server
const startServer = async () => {
  try {
    await connectDB();
    await connectRedis();
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to initialize server:", err);
    process.exit(1);
  }
};

startServer();
