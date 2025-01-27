import { sequelize } from '../src/models';

// Setup test environment variables
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'postgres://localhost:5432/motortrip_test';

// Initialize database connection
beforeAll(async () => {
  await sequelize.authenticate();
  await sequelize.sync({ force: true });
});

// Cleanup database after tests
afterAll(async () => {
  await sequelize.close();
});
