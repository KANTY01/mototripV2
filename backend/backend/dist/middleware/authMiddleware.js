import jwt from 'jsonwebtoken';
import redisClient from '../config/redis.js';
import { ApiError } from '../utils/errors.js';
import { isTokenBlacklisted } from '../utils/auth.js';
const createTokenValidator = (tokenType) => {
    return async (req, res, next) => {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            const secret = tokenType === 'access'
                ? process.env.JWT_SECRET
                : process.env.JWT_REFRESH_SECRET;
            if (!token) {
                throw new ApiError(`No ${tokenType} token provided`, 401);
            }
            const decoded = jwt.verify(token, secret);
            // Check if token is blacklisted
            if (await isTokenBlacklisted(decoded.jti)) {
                throw new ApiError(`${tokenType} token has been revoked`, 401);
            }
            // Verify active session in Redis with type prefix and token ID
            const sessionKey = `${tokenType}_session:${decoded.id}:${decoded.jti}`;
            const sessionActive = await redisClient.exists(sessionKey);
            if (!sessionActive) {
                throw new ApiError(`Invalid or expired ${tokenType} session`, 401);
            }
            req.user = decoded;
            next();
        }
        catch (error) {
            if (error instanceof jwt.JsonWebTokenError) {
                next(new ApiError(`Invalid ${tokenType} token`, 401));
            }
            else if (error instanceof jwt.TokenExpiredError) {
                next(new ApiError(`${tokenType} token has expired`, 401));
            }
            else {
                next(error);
            }
        }
    };
};
export const validateAccessToken = createTokenValidator('access');
export const validateRefreshToken = createTokenValidator('refresh');
