import { UserInstance } from '../models/user';
import { JwtPayload } from 'jsonwebtoken';

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

declare const authService: {
  generateTokens: (user: UserInstance) => TokenPair;
  hashPassword: (password: string) => Promise<string>;
  comparePassword: (password: string, hash: string) => Promise<boolean>;
  validateAccessToken: (token: string) => JwtPayload;
  validateRefreshToken: (token: string) => JwtPayload;
  refreshAccessToken: (refreshToken: string) => string;
};

export default authService;
