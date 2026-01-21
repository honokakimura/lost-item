// lib/redis.ts
import Redis from "ioredis";

const getRedisClient = () => {
  if (!process.env.REDIS_URL) {
    throw new Error("REDIS_URL is not defined");
  }

  // 開発環境で再接続を防ぐためのグローバル変数キャッシュ
  const globalWithRedis = global as typeof globalThis & {
    redis: Redis;
  };

  if (!globalWithRedis.redis) {
    globalWithRedis.redis = new Redis(process.env.REDIS_URL);
  }
  
  return globalWithRedis.redis;
};

export const redis = getRedisClient();