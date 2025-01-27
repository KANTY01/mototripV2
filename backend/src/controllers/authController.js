import User from '../models/user.js';
import authService from '../services/authService.js';

const authController = {
  // User registration
  register: async (req, res) => {
    try {
      const { username, email, password } = req.body;
      
      // Check for existing user
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already exists' });
      }

      // Create new user
      const hashedPassword = await authService.hashPassword(password);
      const user = await User.create({
        username,
        email,
        password_hash: hashedPassword
      });

      // Generate tokens
      const { accessToken, refreshToken } = authService.generateTokens(user);
      
      res.status(201).json({
        id: user.id,
        username: user.username,
        email: user.email,
        accessToken,
        refreshToken
      });
    } catch (error) {
      res.status(500).json({ error: 'Registration failed' });
    }
  },

  // User login
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email } });

      if (!user || !(await authService.comparePassword(password, user.password_hash))) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const { accessToken, refreshToken } = authService.generateTokens(user);
      res.json({ accessToken, refreshToken });
    } catch (error) {
      res.status(500).json({ error: 'Login failed' });
    }
  },

  // Token authentication middleware
  authenticateToken: async (req, res, next) => {
    try {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];
      
      if (!token) return res.sendStatus(401);
      
      const decoded = authService.validateAccessToken(token);
      const user = await User.findByPk(decoded.id);
      
      if (!user) return res.sendStatus(403);
      
      req.user = user;
      next();
    } catch (error) {
      res.status(403).json({ error: error.message });
    }
  },

  // Token refresh
  refreshToken: async (req, res) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) return res.status(400).json({ error: 'Refresh token required' });
      
      const newAccessToken = authService.refreshAccessToken(refreshToken);
      res.json({ accessToken: newAccessToken });
    } catch (error) {
      res.status(500).json({ error: 'Token refresh failed' });
    }
  },

  // User logout
  logout: async (req, res) => {
    try {
      // Invalidate refresh token by setting expiry to now
      await req.user.update({ 
        token_expiry: new Date() 
      });
      res.json({ message: 'Logout successful' });
    } catch (error) {
      res.status(500).json({ error: 'Logout failed' });
    }
  }
};

export default authController;
