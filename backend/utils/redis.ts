import { createClient } from "redis";

//creating the client for redis
export const redis = createClient({
  url: process.env.REDIS_URL,
});

//if there is an error in the redis connection
redis.on("error", (err) => {
  console.error("Redis error:", err);
});

//initializing the redis connection
export async function initRedis() {
  if (!redis.isOpen) await redis.connect();
}
