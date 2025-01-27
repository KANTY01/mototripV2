export default {
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379'
  },
  development: {
    database: 'motortrip',
    username: 'motortrip',
    password: 'securepassword123', 
    host: 'localhost',
    port: 5432,
    dialect: 'postgres',
    dialectOptions: {
      ssl: false
    }
  },
  test: {
    database: process.env.TEST_DB_NAME,
    username: process.env.TEST_DB_USER,
    password: process.env.TEST_DB_PASSWORD,
    host: process.env.TEST_DB_HOST,
    dialect: 'postgres'
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  },
  jwt: {
    secret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    accessExpiration: '15m',
    refreshExpiration: '7d'
  },
  bcrypt: {
    saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  },
  csrf: {
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400000 // 24 hours
    }
  }
};
