import Redis from 'ioredis'
import dotenv from 'dotenv'

dotenv.config()

const redisClient = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD
})

export default redisClient
