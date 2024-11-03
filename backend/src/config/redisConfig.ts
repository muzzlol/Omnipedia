import { createClient } from "redis";

const connectRedis = async (): Promise<typeof redisClient> => {
  const redisURL = process.env.REDIS_URL;
  
  if (!redisURL) {
    throw new Error("REDIS_URL is not defined in the environment variables");
  }
  
  const redisClient = createClient({ url: redisURL });
  try {
    await redisClient.connect();
    console.log('Redis connected successfully');
    return redisClient;
  } catch (err: any) {
    console.error('Redis connection error:', err.message, 'Full error:', err);
    throw err;
  }
};

export default connectRedis;
