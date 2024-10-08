const redis = require('redis');

let client;

const connectToRedis = async () => {
  if (!client) {
    client = redis.createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379'
    });

    client.on('error', (error) => {
      console.error('Redis Client Error', error);
    });

    await client.connect();
  }
  return client;
};

const CACHE_DURATION = 86400; // 24 hours in seconds

const getOrSetCache = async (key, fetchFunction) => {
  try {
    const redisClient = await connectToRedis();
    const cachedData = await redisClient.get(key);
    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const freshData = await fetchFunction();
    await redisClient.setEx(key, CACHE_DURATION, JSON.stringify(freshData));
    return freshData;
  } catch (error) {
    console.error('Cache error:', error);
    return fetchFunction();
  }
};

module.exports = { getOrSetCache };