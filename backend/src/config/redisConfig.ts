import { createClient, RedisClientType } from "redis";

const redisURL = process.env.REDIS_URL;
const redisClient = createClient({ url: redisURL }) as RedisClientType;

const connectRedis = async (): Promise<RedisClientType> => {
  if (!redisURL) {
    throw new Error("REDIS_URL is not defined in the environment variables");
  }

  try {
    await redisClient.connect();
    console.log('Redis connected successfully');
    return redisClient;
  } catch (err: any) {
    console.error('Redis connection error:', err.message, 'Full error:', err);
    throw err;
  }
};

export { redisClient, connectRedis as default};
