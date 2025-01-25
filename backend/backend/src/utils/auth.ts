import jwt from 'jsonwebtoken';
import { ApiError } from './errors.js';
import redisClient from '../config/redis.js';
import AuditLog from '../models/auditLog.js';
import type { JwtPayload } from '../middleware/authMiddleware';
import { v4 as uuidv4 } from 'uuid';

interface TokenPair {
  accessToken: string;
  refreshToken: string;
  needsRenewal?: boolean;
}

const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';
const MAX_SESSIONS_PER_USER = 5;
const ANOMALY_THRESHOLD = 5; // Failed attempts before revocation
const GRACE_PERIOD = 300; // 5 minutes in seconds

export const trackAuthAnomaly = async (userId: number, ipAddress: string): Promise<void> => {
  const key = `auth_anomaly:${userId}`;
  const attempts = await redisClient.incr(key);
  
  if (attempts === 1) {
    await redisClient.expire(key, GRACE_PERIOD);
  }

  if (attempts >= ANOMALY_THRESHOLD) {
    await revokeUserSessions(userId);
    await redisClient.del(key);
    
    // Audit log integration
    await AuditLog.create({
      userId: String(userId),
      action: 'AUTO_REVOKE',
      details: `Automatic session revocation due to ${attempts} failed auth attempts`,
      ipAddress: ipAddress
    });
  }
};

export const generateTokenPair = async (user: JwtPayload): Promise<TokenPair> => {
  try {
    // Generate unique token IDs
    const accessTokenId = uuidv4();
    const refreshTokenId = uuidv4();

    const accessToken = jwt.sign(
      { 
        id: user.id, 
        role: user.role,
        jti: accessTokenId 
      },
      process.env.JWT_SECRET!,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );

    const refreshToken = jwt.sign(
      { 
        id: user.id, 
        role: user.role,
        jti: refreshTokenId
      },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: REFRESH_TOKEN_EXPIRY }
    );

    // Get user's active sessions
    const sessionPattern = `refresh_session:${user.id}:*`;
    const activeSessions = await redisClient.keys(sessionPattern);

    // Enforce max sessions per user
    if (activeSessions.length >= MAX_SESSIONS_PER_USER) {
      // Remove oldest session
      const oldestSession = activeSessions[0];
      await redisClient.del(oldestSession);
    }

    // Store both sessions in Redis with type prefixes and token IDs
    await Promise.all([
      redisClient.set(
        `access_session:${user.id}:${accessTokenId}`, 
        'active', 
        'EX', 
        900 // 15 minutes
      ),
      redisClient.set(
        `refresh_session:${user.id}:${refreshTokenId}`, 
        'active', 
        'EX', 
        604800 // 7 days
      )
    ]);

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError('Token generation failed', 500);
  }
};

export const refreshAccessToken = async (refreshToken: string, ipAddress: string): Promise<TokenPair> => {
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!, { ignoreExpiration: true }) as JwtPayload & { jti: string, exp: number };
    
    // Calculate remaining token validity
    const now = Math.floor(Date.now() / 1000);
    const expiresIn = decoded.exp - now;
    
    // Handle grace period for near-expiry tokens
    let needsRenewal = false;
    if (expiresIn < GRACE_PERIOD) {
      needsRenewal = true;
    }

    // Atomic session verification, invalidation, and TTL extension
    const sessionKey = `refresh_session:${decoded.id}:${decoded.jti}`;
    const multi = redisClient.multi()
      .exists(sessionKey)
      .del(sessionKey)
      // Extend grace period if needed
      .set(`grace_period:${decoded.id}:${decoded.jti}`, 'active', 'EX', GRACE_PERIOD);
    
    const results = await multi.exec();
    
    if (!results) {
      throw new ApiError('Token refresh transaction failed', 500);
    }
    
    // Type assertion for Redis results [error, value][]
    const [[_err1, sessionActive]] = results as [[Error | null, number]];
    
    if (!sessionActive) {
      throw new ApiError('Invalid refresh token', 401);
    }

    // Atomic blacklist and new token generation
    const newTokens = await generateTokenPair({ id: decoded.id, role: decoded.role });
    
    const storeResults = await redisClient.multi()
      .set(`blacklist:${decoded.jti}`, 'revoked', 'EX', 604800)
      .set(`csrf:${decoded.id}:${newTokens.accessToken}`, uuidv4(), 'EX', 900)
      .exec();

    if (!storeResults || (storeResults as [Error | null, unknown][]).some(([err]) => err)) {
      throw new ApiError('Failed to secure new token session', 500);
    }

    // Audit log the rotation
    await AuditLog.create({
      userId: String(decoded.id),
      action: 'TOKEN_ROTATION',
      details: `Refresh token rotated from IP: ${ipAddress}`,
      ipAddress
    });

    return { 
      ...newTokens,
      needsRenewal
    };
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new ApiError('Invalid refresh token', 401);
    }
    throw error;
  }
};

export const revokeUserSessions = async (userId: number): Promise<void> => {
  const sessionPattern = `*_session:${userId}:*`;
  const sessions = await redisClient.keys(sessionPattern);
  
  if (sessions.length > 0) {
    await redisClient.del(...sessions);
  }
};

export const isTokenBlacklisted = async (jti: string): Promise<boolean> => {
  return await redisClient.exists(`blacklist:${jti}`) === 1;
};
