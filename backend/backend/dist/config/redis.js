import { Redis } from 'ioredis';
import config from './config.js';
const redisClient = new Redis(config.REDIS_URL, {
    retryStrategy: (times) => Math.min(times * 100, 3000)
});
redisClient.on('connect', () => console.log('Redis connected'));
redisClient.on('error', (err) => console.error('Redis error:', err));
export default redisClient;
