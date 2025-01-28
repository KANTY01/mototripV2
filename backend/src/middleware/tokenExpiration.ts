import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import redisClient from '../config/redis.js';
import { ApiError } from '../utils/errors.js';
import type { JwtPayload } from './authMiddleware';
import { refreshAccessToken } from '../utils/auth.js';

const GRACE_PERIOD = 300; // 5 minutes in seconds

export const handleTokenExpiration = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return next();
  }

  try {
    // First try to verify normally
    try {
      jwt.verify(token, process.env.JWT_SECRET!);
      return next();
    } catch (verifyError) {
      // Only proceed with expiration handling if it's an expiration error
      if (!(verifyError instanceof jwt.TokenExpiredError)) {
        throw verifyError;
      }
    }

    // Token is expired, check for grace period
    const decoded = jwt.verify(token, process.env.JWT_SECRET!, { ignoreExpiration: true }) as JwtPayload & { jti: string };
    const graceKey = `grace_period:${decoded.id}:${decoded.jti}`;
    const remaining = await redisClient.ttl(graceKey);

    if (remaining > 0) {
      // Token is in grace period, allow the request
      req.headers['x-grace-period'] = remaining.toString();
      return next();
    }

    // Check if refresh token exists in request
    const refreshToken = req.headers['x-refresh-token'] as string;
    if (refreshToken) {
      try {
        // Attempt to refresh the token
        const ipAddress = req.ip || req.socket.remoteAddress || 'unknown';
        const newTokens = await refreshAccessToken(refreshToken, ipAddress);
        
        // Set the new tokens in response headers
        res.setHeader('X-New-Access-Token', newTokens.accessToken);
        if (newTokens.refreshToken) {
          res.setHeader('X-New-Refresh-Token', newTokens.refreshToken);
        }
        
        // Update request authorization for this request
        req.headers.authorization = `Bearer ${newTokens.accessToken}`;
        return next();
      } catch (refreshError) {
        // If refresh fails, force re-authentication
        throw new ApiError('Authentication required', 401);
      }
    }

    // No refresh token or grace period, require re-authentication
    throw new ApiError('Token expired', 401);
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error);
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new ApiError('Invalid token', 401));
    }
    return next(new ApiError('Authentication failed', 401));
  }
};
