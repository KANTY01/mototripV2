import 'dotenv/config';

interface Environment {
  JWT_SECRET: string;
  JWT_REFRESH_SECRET: string;
  REDIS_URL: string;
  NODE_ENV: 'development' | 'test' | 'production';
  DATABASE_URL: string;
}

function validateEnv(env: NodeJS.ProcessEnv): Environment {
  console.log('Environment variables:', {
    JWT_SECRET: env.JWT_SECRET,
    JWT_REFRESH_SECRET: env.JWT_REFRESH_SECRET,
    REDIS_URL: env.REDIS_URL,
    DATABASE_URL: env.DATABASE_URL,
    NODE_ENV: env.NODE_ENV
  });
  if (!env.JWT_SECRET || env.JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters');
  }
  
  if (!env.JWT_REFRESH_SECRET || env.JWT_REFRESH_SECRET.length < 32) {
    throw new Error('JWT_REFRESH_SECRET must be at least 32 characters');
  }

  if (!env.REDIS_URL) {
    throw new Error('REDIS_URL is required');
  }

  if (!env.DATABASE_URL) {
    throw new Error('DATABASE_URL is required');
  }

  if (!['development', 'test', 'production'].includes(env.NODE_ENV || '')) {
    throw new Error('Invalid NODE_ENV value');
  }

  return {
    JWT_SECRET: env.JWT_SECRET,
    JWT_REFRESH_SECRET: env.JWT_REFRESH_SECRET,
    REDIS_URL: env.REDIS_URL,
    DATABASE_URL: env.DATABASE_URL,
    NODE_ENV: (env.NODE_ENV || 'development') as Environment['NODE_ENV']
  };
}

const config = validateEnv(process.env);
export default config;
