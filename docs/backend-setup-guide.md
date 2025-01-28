# Backend Setup Guide

## Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- Redis (v6 or higher)
- npm or yarn

## IMPORTANT: Required Services
Before starting the application, ensure these services are running:
1. PostgreSQL service must be active
2. Redis server must be running
3. Database must be initialized with migrations
4. Default users must be seeded

## Step 1: Initial Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

## Step 2: Environment Configuration

1. Create environment file:
```bash
cp .env.example .env
```

2. Configure your `.env` file with the following settings:
```env
# Server Configuration
PORT=4000

# JWT Configuration
JWT_SECRET=your_secure_jwt_secret_32_chars_long_123
JWT_REFRESH_SECRET=your_secure_refresh_secret_32_chars_123

# Database Configuration
DATABASE_URL=postgres://barbatos:barbatos@127.0.0.1:5432/motortrip_dev

# Redis Configuration
REDIS_URL=redis://localhost:6379

# Environment
NODE_ENV=development
```

## Step 3: Database Setup

1. Install PostgreSQL if not already installed:
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

2. Start PostgreSQL service:
```bash
sudo service postgresql start
```

3. Verify PostgreSQL is running:
```bash
sudo service postgresql status
# Should show "active (running)"
```

4. Create database and user:
```bash
# Connect as postgres user
sudo -u postgres psql

# Create database
CREATE DATABASE motortrip_dev;

# Create user with password
CREATE USER barbatos WITH PASSWORD 'barbatos';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE motortrip_dev TO barbatos;

# Connect to the database
\c motortrip_dev

# Grant schema privileges
GRANT ALL ON SCHEMA public TO barbatos;

# Exit psql
\q
```

5. Verify database connection:
```bash
psql -h 127.0.0.1 -U barbatos -d motortrip_dev
# Enter password when prompted: barbatos
```

6. Build TypeScript files:
```bash
npm run build
```

7. Run database migrations:
```bash
npm run migrate
```

8. Seed default users:
```bash
node scripts/temp-seed.mjs
```

## Step 4: Redis Setup

1. Install Redis if not already installed:
```bash
sudo apt update
sudo apt install redis-server
```

2. Start Redis server:
```bash
redis-server
```

3. Verify Redis is running:
```bash
redis-cli ping
# Should respond with "PONG"
```

## Step 5: Running the Server

### Pre-start Checklist
Before starting the server, verify:
1. PostgreSQL service is running:
```bash
sudo service postgresql status
```
2. Redis server is running:
```bash
redis-cli ping
```
3. Database is migrated and seeded:
```bash
# Check migration status
npx sequelize-cli db:migrate:status

# Seed users if needed
node scripts/temp-seed.mjs
```

### Development Mode

1. First, ensure no other process is using port 4000:
```bash
# Find process using port 4000
sudo lsof -i :4000

# Kill the process if needed
kill -9 <PID>
```

2. Start the server:
```bash
npm run build && npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

## Common Issues & Solutions

### Authentication Issues
If login is not working:
1. Verify all required services are running:
```bash
# Check PostgreSQL
sudo service postgresql status

# Check Redis
redis-cli ping

# Restart services if needed
sudo service postgresql restart
redis-server
```

2. Verify database state:
```bash
# Check migrations
npx sequelize-cli db:migrate:status

# Re-run migrations if needed
npm run migrate

# Re-seed default users
node scripts/temp-seed.mjs
```

### Port Already in Use
If you see `EADDRINUSE: address already in use :::4000`:
```bash
# Find the process
sudo lsof -i :4000

# Kill the process
kill -9 <PID>
```

### Database Connection Issues

1. Verify PostgreSQL is running:
```bash
sudo service postgresql status
```

2. Common fixes:
```bash
# Restart PostgreSQL
sudo service postgresql restart

# Recreate database
dropdb motortrip_dev
createdb motortrip_dev

# Reset privileges
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE motortrip_dev TO barbatos;"
```

### Redis Connection Issues

1. Verify Redis is running:
```bash
redis-cli ping
```

2. Common fixes:
```bash
# Start Redis if not running
redis-server

# Restart Redis
sudo service redis-server restart

# Clear Redis cache
redis-cli flushall
```

### TypeScript/ESM Module Issues

If you encounter `ERR_UNKNOWN_FILE_EXTENSION: Unknown file extension ".ts"`:

1. Ensure TypeScript is compiled:
```bash
npm run build
```

2. Run the compiled JavaScript files:
```bash
node dist/server.js
```

### Migration Issues

1. If migrations fail:
```bash
# Undo all migrations
npm run migrate:undo:all

# Rebuild TypeScript
npm run build

# Run migrations again
npm run migrate
```

2. For specific migration issues:
```bash
# Check migration status
npx sequelize-cli db:migrate:status

# Run specific migration
npx sequelize-cli db:migrate --to YYYYMMDDHHMMSS-migration-name.js
```

## Project Structure
```
backend/
├── __tests__/          # Test files
├── config/            # Configuration files
├── migrations/        # Database migrations
├── scripts/          # Utility scripts
├── src/
│   ├── config/       # Application configuration
│   ├── controllers/  # Route controllers
│   ├── middleware/   # Custom middleware
│   ├── models/       # Sequelize models
│   ├── routes/       # API routes
│   ├── services/     # Business logic
│   ├── types/        # TypeScript types
│   ├── utils/        # Utility functions
│   └── server.ts     # Server entry point
├── .env              # Environment variables
├── package.json      # Dependencies and scripts
└── tsconfig.json     # TypeScript configuration
```

## Available Scripts

```bash
# Build TypeScript files
npm run build

# Start development server
npm run dev

# Run database migrations
npm run migrate

# Undo last migration
npm run migrate:undo

# Run tests
npm test

# Check database connection
npm run test-db
```

## Testing the Setup

1. After starting the server, verify it's running:
```bash
curl http://localhost:4000/api
```

2. Test user authentication with default credentials:
```bash
# Login with test user
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@motortrip.com","password":"User123!"}'
```

## Backup & Recovery

1. Database backup:
```bash
pg_dump -U barbatos motortrip_dev > backup.sql
```

2. Database restore:
```bash
psql -U barbatos motortrip_dev < backup.sql
