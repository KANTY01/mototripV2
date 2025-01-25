# Backend Setup Guide

## Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- Redis (v6 or higher)
- npm or yarn

## Step 1: Initial Setup

1. Clone and navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create environment file:
```bash
cp .env.example .env
```

## Step 2: Environment Configuration

Edit `.env` file with your configurations:

```env
# Server
PORT=3001
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=motortrip_dev
DB_USER=your_username
DB_PASSWORD=your_password

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_jwt_refresh_secret
JWT_EXPIRATION=1h
JWT_REFRESH_EXPIRATION=7d

# Security
CORS_ORIGIN=http://localhost:3000
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
```

## Step 3: Database Setup

1. Create PostgreSQL database:
```bash
createdb motortrip_dev
```

2. Run database migrations:
```bash
npm run migrate
# or
yarn migrate
```

3. (Optional) Seed initial data:
```bash
npm run seed
# or
yarn seed
```

## Step 4: Redis Setup

1. Start Redis server:
```bash
redis-server
```

2. Verify Redis connection:
```bash
npm run test:redis
# or
yarn test:redis
```

## Step 5: Running the Server

### Development Mode
```bash
npm run dev
# or
yarn dev
```

### Production Mode
```bash
npm run build
npm start
# or
yarn build
yarn start
```

## Step 6: Verify Installation

1. Check server health:
```bash
curl http://localhost:3001/health
```

2. Test authentication:
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## Common Issues & Solutions

### Database Connection Issues
1. Verify PostgreSQL is running:
```bash
pg_isready
```

2. Check database credentials:
```bash
psql -U your_username -d motortrip_dev
```

3. Reset database if needed:
```bash
npm run db:reset
# or
yarn db:reset
```

### Redis Connection Issues
1. Verify Redis is running:
```bash
redis-cli ping
```

2. Clear Redis cache if needed:
```bash
redis-cli flushall
```

### Migration Issues
1. Reset migrations:
```bash
npm run migrate:reset
# or
yarn migrate:reset
```

2. Run specific migration:
```bash
npm run migrate:up -- --to YYYYMMDDHHMMSS-migration-name.js
# or
yarn migrate:up --to YYYYMMDDHHMMSS-migration-name.js
```

## Development Commands

### Database Operations
```bash
# Create new migration
npm run migrate:create -- --name your-migration-name

# Undo last migration
npm run migrate:undo

# Run pending migrations
npm run migrate:up

# Show migration status
npm run migrate:status
```

### Testing
```bash
# Run all tests
npm test

# Run specific test file
npm test -- path/to/test-file.test.ts

# Run tests with coverage
npm run test:coverage
```

### Code Quality
```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Type check
npm run type-check
```

## Project Structure
```
backend/
├── __tests__/          # Test files
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Custom middleware
│   ├── migrations/     # Database migrations
│   ├── models/         # Sequelize models
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   ├── types/          # TypeScript types
│   ├── utils/          # Utility functions
│   └── server.ts       # Server entry point
├── .env                # Environment variables
├── .sequelizerc        # Sequelize configuration
├── package.json        # Dependencies and scripts
└── tsconfig.json       # TypeScript configuration
```

## Backup & Recovery
1. Database backup:
```bash
pg_dump -U your_username motortrip_dev > backup.sql
```

2. Database restore:
```bash
psql -U your_username motortrip_dev < backup.sql
```




