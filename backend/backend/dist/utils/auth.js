import jwt from 'jsonwebtoken';
import { ApiError } from './errors.js';
import redisClient from '../config/redis.js';
import { v4 as uuidv4 } from 'uuid';
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';
const MAX_SESSIONS_PER_USER = 5;
export const generateTokenPair = async (user) => {
    try {
        // Generate unique token IDs
        const accessTokenId = uuidv4();
        const refreshTokenId = uuidv4();
        const accessToken = jwt.sign({
            id: user.id,
            role: user.role,
            jti: accessTokenId
        }, process.env.JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
        const refreshToken = jwt.sign({
            id: user.id,
            role: user.role,
            jti: refreshTokenId
        }, process.env.JWT_REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
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
            redisClient.set(`access_session:${user.id}:${accessTokenId}`, 'active', 'EX', 900 // 15 minutes
            ),
            redisClient.set(`refresh_session:${user.id}:${refreshTokenId}`, 'active', 'EX', 604800 // 7 days
            )
        ]);
        return { accessToken, refreshToken };
    }
    catch (error) {
        throw new ApiError('Token generation failed', 500);
    }
};
export const refreshAccessToken = async (refreshToken) => {
    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        // Verify refresh session exists and is active
        const sessionKey = `refresh_session:${decoded.id}:${decoded.jti}`;
        const sessionActive = await redisClient.exists(sessionKey);
        if (!sessionActive) {
            throw new ApiError('Invalid refresh token', 401);
        }
        // Invalidate the used refresh token immediately (one-time use)
        await redisClient.del(sessionKey);
        // Add to blacklist for extra security until original expiration
        await redisClient.set(`blacklist:${decoded.jti}`, 'revoked', 'EX', 604800 // 7 days
        );
        // Generate new token pair
        return generateTokenPair({ id: decoded.id, role: decoded.role });
    }
    catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            throw new ApiError('Invalid refresh token', 401);
        }
        throw error;
    }
};
export const revokeUserSessions = async (userId) => {
    const sessionPattern = `*_session:${userId}:*`;
    const sessions = await redisClient.keys(sessionPattern);
    if (sessions.length > 0) {
        await redisClient.del(...sessions);
    }
};
export const isTokenBlacklisted = async (jti) => {
    return await redisClient.exists(`blacklist:${jti}`) === 1;
};
