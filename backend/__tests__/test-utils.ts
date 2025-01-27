import { User } from '../src/models/index.js';
import { app } from '../src/server.js';
import authService from '../src/services/authService.js';
import type { UserInstance } from '../src/models/user.js';

interface TestUserParams {
  role?: 'driver' | 'rider' | 'admin';
}

export const createTestUser = async (params: TestUserParams = {}): Promise<UserInstance> => {
  return User.create({
    firstName: 'Test',
    lastName: 'User',
    email: `testuser+${Date.now()}@motortrip.com`,
    password: 'Testpass123!',
    phoneNumber: '+48123456789',
    role: params.role || 'driver'
  });
};

export const getAuthHeader = async (): Promise<string> => {
  const user = await createTestUser();
  const { accessToken } = authService.generateTokens(user);
  return `Bearer ${accessToken}`;
};
