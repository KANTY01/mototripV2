import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import { ApiError } from '../utils/errors.js';
import { generateTokenPair, refreshAccessToken, revokeUserSessions } from '../utils/auth.js';
import redisClient from '../config/redis.js';
const authController = {
    register: async (req, res) => {
        try {
            const { username, email, password } = req.body;
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                throw new ApiError('Email already exists', 400);
            }
            const user = await User.create({
                username,
                email,
                password_hash: await User.hashPassword(password),
                role: 'user'
            });
            const tokens = await generateTokenPair({
                id: user.id,
                role: user.role
            });
            res.status(201).json({
                id: user.id,
                ...tokens
            });
        }
        catch (error) {
            if (error instanceof ApiError) {
                res.status(error.statusCode).json({ error: error.message });
            }
            else {
                res.status(500).json({ error: 'Registration failed' });
            }
        }
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ where: { email } });
            if (!user || !(await User.comparePassword(password, user.password_hash))) {
                throw new ApiError('Invalid credentials', 401);
            }
            const tokens = await generateTokenPair({
                id: user.id,
                role: user.role
            });
            res.json({
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role.toUpperCase(),
                    created_at: user.created_at,
                    updated_at: user.updated_at
                },
                ...tokens
            });
        }
        catch (error) {
            if (error instanceof ApiError) {
                res.status(error.statusCode).json({ error: error.message });
            }
            else {
                res.status(500).json({ error: 'Login failed' });
            }
        }
    },
    refreshToken: async (req, res) => {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                throw new ApiError('Refresh token required', 400);
            }
            const ipAddress = req.ip || req.socket.remoteAddress || 'unknown';
            const tokens = await refreshAccessToken(refreshToken, ipAddress);
            if (tokens.needsRenewal) {
                res.setHeader('Renew-Required', 'true');
            }
            res.status(200).json(tokens);
        }
        catch (error) {
            if (error instanceof ApiError) {
                res.status(error.statusCode).json({ error: error.message });
            }
            else {
                res.status(500).json({ error: 'Token refresh failed' });
            }
        }
    },
    logout: async (req, res) => {
        try {
            const user = req.user;
            if (!user?.id) {
                throw new ApiError('Invalid user session', 401);
            }
            // Get the current token's JTI
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) {
                throw new ApiError('No token provided', 401);
            }
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // Add current token to blacklist
            await redisClient.set(`blacklist:${decoded.jti}`, 'revoked', 'EX', 900 // 15 minutes (matching access token expiry)
            );
            // Optionally revoke all user sessions (e.g., for password change or security breach)
            const revokeAll = req.query.revokeAll === 'true';
            if (revokeAll) {
                await revokeUserSessions(user.id);
                res.json({ message: 'All sessions revoked successfully' });
            }
            else {
                // Just remove the current session
                await Promise.all([
                    redisClient.del(`access_session:${user.id}:${decoded.jti}`),
                    redisClient.del(`refresh_session:${user.id}:${decoded.jti}`)
                ]);
                res.json({ message: 'Logout successful' });
            }
        }
        catch (error) {
            if (error instanceof ApiError) {
                res.status(error.statusCode).json({ error: error.message });
            }
            else if (error instanceof jwt.JsonWebTokenError) {
                res.status(401).json({ error: 'Invalid token' });
            }
            else {
                res.status(500).json({ error: 'Logout failed' });
            }
        }
    }
};
export default authController;
