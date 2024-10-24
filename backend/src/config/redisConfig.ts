// import { RedisClientOptions } from "redis";
import dotenv from "dotenv";

dotenv.config(); // Load .env variables

// export const redisConfig: RedisClientOptions = {
//   password: process.env.REDIS_PASSWORD || "",
//   socket: {
//     host: process.env.REDIS_SOCKET_HOST || "127.0.0.1",
//     port: parseInt(process.env.REDIS_SOCKET_PORT || "6379", 10),
//   },
// };

import Redis from "ioredis";

// Load environment variables from the .env file
const redisPassword = process.env.REDIS_PASSWORD || "";
const redisSocketHost = process.env.REDIS_SOCKET_HOST || "localhost";
const redisSocketPort = parseInt(process.env.REDIS_SOCKET_PORT || "6379", 10);

const redisClient = new Redis({
  host: redisSocketHost,
  port: redisSocketPort,
  password: redisPassword,
  connectTimeout: 30000,
});

export default redisClient;
