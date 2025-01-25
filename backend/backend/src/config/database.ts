import { Sequelize } from 'sequelize';
import config from './config.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Parse database URL into connection parameters
const dbUrl = new URL(config.DATABASE_URL);

// Initialize Sequelize with connection parameters
const sequelize = new Sequelize(dbUrl.pathname.split('/')[1], dbUrl.username, dbUrl.password, {
  dialect: 'postgres',
  host: dbUrl.hostname,
  port: Number(dbUrl.port),
  logging: false,
  dialectOptions: {
    ssl: process.env.NODE_ENV === 'production' ? {
      require: true,
      rejectUnauthorized: false
    } : undefined
  }
});

export default sequelize;
