import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import topicRoutes from "./routes/topicRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import resourceRoutes from "./routes/resourceRoutes.js";
import errorHandler from "./middleware/errorHandler.js";
import searchRoutes from "./routes/searchRoutes.js";
import voteRoutes from "./routes/voteRoutes.js";
import redis from "redis";
import { redisConfig } from "./config/redisConfig.js";

// redis setup
export const redisClient = redis.createClient(redisConfig);
redisClient.connect().then(() => {
  console.log("Redis connected.");
});

dotenv.config();

const app = express();

// CORS middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"], // Konnect to frontend
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

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to the database", err);
    process.exit(1);
  });
