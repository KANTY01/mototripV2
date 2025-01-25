import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import redisClient from '../config/redis.js';
import { ApiError } from '../utils/errors.js';
import type { JwtPayload } from './authMiddleware';

export const handleTokenExpiration = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!, { ignoreExpiration: true });
      const { exp, jti } = decoded as JwtPayload;
      
      if (exp && Date.now() >= exp * 1000) {
        const graceKey = `grace_period:${jti}`;
        const remaining = await redisClient.ttl(graceKey);
        
        if (remaining > 0) {
          req.headers['x-grace-period'] = remaining.toString();
          return next();
        }
        
        throw new ApiError('Token expired', 401);
      }
    } catch (error) {
      if (error instanceof ApiError) {
        return next(error);
      }
    }
  }
  next();
};
