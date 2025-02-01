import Redis from 'ioredis'
import dotenv from 'dotenv'

dotenv.config()

const redisClient = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000)
    return delay
  },
  maxRetriesPerRequest: 3
})

redisClient.on('error', (err) => {
  console.error('Redis connection error:', err)
})

redisClient.on('connect', () => {
  console.log('Successfully connected to Redis')
})

// Wrapper for Redis operations with fallback
const cache = {
  async get(key) {
    try {
      return await redisClient.get(key)
    } catch (error) {
      console.error('Redis get error:', error)
      return null
    }
  },
  async set(key, value, ...args) {
    try {
      return await redisClient.set(key, value, ...args)
    } catch (error) {
      console.error('Redis set error:', error)
      return null
    }
  },
  async del(key) {
    try {
      return await redisClient.del(key)
    } catch (error) {
      console.error('Redis del error:', error)
      return null
    }
  }
}

export default cache
