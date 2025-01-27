import Redis from 'ioredis';
import config from '../config/config.js';

const redisClient = new Redis(config.redis.url);

redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

redisClient.on('error', (err) => {
  console.error('Redis connection error:', err);
});

export default redisClient;
