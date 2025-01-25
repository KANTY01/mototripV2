import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import config from '../config/config.js';
import redisClient from '../utils/redis.js';

const authService = {
  // Generate access and refresh tokens
  generateTokens: (user) => {
    const accessToken = jwt.sign(
      {
        id: user.id,
        role: user.role
      },
      config.jwt.secret,
      { expiresIn: config.jwt.accessExpiration }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      config.jwt.refreshSecret,
      { expiresIn: config.jwt.refreshExpiration }
    );

    return { accessToken, refreshToken };
  },

  // Hash user password
  hashPassword: async (password) => {
    return await bcrypt.hash(password, config.bcrypt.saltRounds);
  },

  // Compare password with hash
  comparePassword: async (password, hash) => {
    return await bcrypt.compare(password, hash);
  },

  // Validate access token
  validateAccessToken: (token) => {
    return jwt.verify(token, config.jwt.secret);
  },

  // Validate refresh token
  validateRefreshToken: (token) => {
    return jwt.verify(token, config.jwt.refreshSecret);
  },

  // Generate new access token from refresh token
  refreshAccessToken: (refreshToken) => {
    const { id } = this.validateRefreshToken(refreshToken);
    return jwt.sign({ id }, config.jwt.secret, { 
      expiresIn: config.jwt.accessExpiration 
    });
  },

  // Rotate refresh token and invalidate previous one
  rotateRefreshToken: async (oldRefreshToken) => {
    // Invalidate old token
    await redisClient.del(`refresh_token:${oldRefreshToken}`);
    
    // Generate new tokens
    const payload = this.validateRefreshToken(oldRefreshToken);
    const { accessToken, refreshToken } = this.generateTokens(payload);
    const newAccessToken = accessToken;
    const newRefreshToken = refreshToken;
    
    // Store new refresh token
    await redisClient.set(
      `refresh_token:${newRefreshToken}`,
      payload.id,
      'EX', config.jwt.refreshExpiration
    );
    
    return { newAccessToken, newRefreshToken };
  },

  // Token expiration handling
  setTokenCookies: (res, tokens) => {
    res.cookie('access_token', tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: config.jwt.accessExpiration * 1000
    });
    
    res.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: config.jwt.refreshExpiration * 1000
    });
  }
};

export default authService;
