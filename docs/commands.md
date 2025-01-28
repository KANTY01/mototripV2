# MotorTrip Command Reference Guide

This guide provides a comprehensive list of commands used in the MotorTrip project, organized by category and purpose.

## Table of Contents
- [System Services Management](#system-services-management)
- [Database Management](#database-management)
- [Backend Development](#backend-development)
- [Frontend Development](#frontend-development)
- [Testing & Debugging](#testing--debugging)
- [Authentication & Security](#authentication--security)
- [Utility Commands](#utility-commands)
- [Common Scenarios](#common-scenarios)

## System Services Management

### PostgreSQL Service
```bash
# Check PostgreSQL service status
sudo service postgresql status

# Start PostgreSQL service
sudo service postgresql start
```
**When to use**: Before starting the application or when database connections fail

### Redis Service
```bash
# Test Redis connection
redis-cli ping

# Start Redis server
redis-server
```
**When to use**: Before starting the application or when session management issues occur

## Database Management

### Database Access
```bash
# Connect to database
psql -h 127.0.0.1 -U barbatos -d motortrip_dev

# List all tables
psql -h 127.0.0.1 -U barbatos -d motortrip_dev -c "\dt"

# View table permissions
sudo -u postgres psql -d motortrip_dev -c "\dp"
```
**When to use**: When you need to inspect or modify the database directly

### Database Permissions
```bash
# Grant necessary privileges
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE motortrip_dev TO barbatos;" && \
sudo -u postgres psql -d motortrip_dev -c "GRANT ALL ON SCHEMA public TO barbatos;"
```
**When to use**: After database creation or when encountering permission issues

### Database Migrations
```bash
# Create new migration
npx sequelize-cli migration:generate --name description

# Run migrations
cd backend && npx sequelize-cli db:migrate

# Reset database (caution: destroys data)
cd backend && npm run reset-db

# Check migration status
npx sequelize-cli db:migrate:status

# Run specific migration
npx sequelize-cli db:migrate --to YYYYMMDDHHMMSS-migration-name.js
```
**When to use**: When updating database schema or resetting for clean state

### Database Backup & Recovery
```bash
# Create database backup
pg_dump -U barbatos motortrip_dev > backup.sql

# Restore database from backup
psql -U barbatos motortrip_dev < backup.sql

# Recreate database if needed
dropdb motortrip_dev
createdb motortrip_dev
```
**When to use**: Before major changes or when need to restore data

### Data Seeding
```bash
# Seed initial data
cd backend && node scripts/temp-seed.mjs

# Seed users specifically
cd backend && npm run build && node dist/scripts/seed-users.js
```
**When to use**: After fresh installation or database reset

## Backend Development

### Starting the Backend
```bash
# Normal start
cd backend && npm run dev

# Start with debugging
cd backend && NODE_ENV=development DEBUG=* npm run dev

# Start after building
cd backend && npm run build && npm run dev
```
**When to use**: During development or when starting the application

### Building the Backend
```bash
# Build TypeScript files
cd backend && npm run build

# Run compiled JavaScript
node dist/server.js
```
**When to use**: Before running production server or after code changes

### Process Management
```bash
# Kill existing Node processes
killall node

# Kill process on specific port
sudo kill -9 $(sudo lsof -t -i:4000) || true

# Find process using port
sudo lsof -i :4000
```
**When to use**: When port is in use or need to restart services

## Frontend Development

### Starting the Frontend
```bash
# Start development server
cd frontend && npm run dev
```
**When to use**: During frontend development

### Building the Frontend
```bash
# Build for production
cd frontend && npm run build
```
**When to use**: Before deployment

### Development Server Hosting
```bash
# Install localtunnel globally
sudo npm install -g localtunnel

# Start tunnel (in a separate terminal)
lt --port 3000
```
**When to use**: When you need to make your development server accessible from any network
**Note**: After getting the tunnel URL, update allowedHosts in vite.config.ts

### Tunnel Management
```bash
# Find your tunnel password
curl https://loca.lt/mytunnelpassword

# Check if port 3000 is available
sudo lsof -i :3000

# Kill process on port 3000 if needed
sudo kill -9 $(sudo lsof -t -i:3000)
```
**When to use**: When setting up or troubleshooting external access to your development server

## Testing & Debugging

### Connection Testing
```bash
# Test database connection
cd backend && npm run test-db
cd backend && npm run build && node build/scripts/test-db-connection.js

# Test API health
curl http://localhost:4000/api/health

# Test Redis connection
redis-cli ping
```
**When to use**: When troubleshooting connectivity issues

### Dependency Checking
```bash
# Check critical dependencies
cd backend && npm list | grep -E "bcrypt|jsonwebtoken|ioredis"

# Check for outdated packages
npm outdated
```
**When to use**: When verifying package versions or troubleshooting

### Log Viewing
```bash
# View server logs
cd backend && tail -f dist/server.js

# View PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-*.log

# View Redis logs
redis-cli monitor
```
**When to use**: When debugging issues or monitoring server

## Authentication & Security

### User Management
```bash
# Reset admin password
cd backend && node scripts/reset-admin-password.cjs

# View user details
psql -h 127.0.0.1 -U barbatos -d motortrip_dev -c "SELECT id, email, role FROM users WHERE email = 'admin@motortrip.com';"

# Test authentication
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@motortrip.com","password":"Admin123!"}'
```
**When to use**: When managing users or testing authentication

## Common Scenarios

### Complete Backend Reset
```bash
# Stop existing processes
killall node

# Rebuild and restart
cd backend && npm run build && npm run dev
```
**When to use**: When experiencing unexplained issues or after major changes

### Database Reset and Seed
```bash
# Reset database
cd backend && npm run reset-db

# Run migrations
cd backend && npx sequelize-cli db:migrate

# Seed data
cd backend && node scripts/temp-seed.mjs
```
**When to use**: When need fresh database state

### Service Health Check
```bash
# Check all critical services
sudo service postgresql status
redis-cli ping
curl http://localhost:4000/api/health
```
**When to use**: Before starting development or when troubleshooting

### Environment Setup
```bash
# Create environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Set secure JWT secrets
echo "JWT_SECRET=$(openssl rand -base64 32)" >> backend/.env
echo "JWT_REFRESH_SECRET=$(openssl rand -base64 32)" >> backend/.env
```
**When to use**: During initial setup or when refreshing environment configuration

## Best Practices

1. **Always check services** before starting development:
   - PostgreSQL status
   - Redis connection
   - Backend health check

2. **Database operations**:
   - Backup before major changes
   - Use migrations for schema changes
   - Verify permissions after setup

3. **Process management**:
   - Check for port conflicts
   - Kill existing processes when needed
   - Use proper shutdown procedures

4. **Security**:
   - Regularly rotate admin passwords
   - Check logs for suspicious activity
   - Keep dependencies updated
   - Use secure JWT secrets
   - Enable SSL in production

## Troubleshooting Tips

1. **Database Connection Issues**:
   - Verify PostgreSQL is running
   - Check user permissions
   - Validate connection string
   - Check SSL settings in production

2. **Port Conflicts**:
   - Check for running processes
   - Kill processes if necessary
   - Verify correct ports in config
   - Check firewall settings

3. **Authentication Problems**:
   - Verify Redis is running
   - Check user credentials
   - Validate JWT configuration
   - Clear Redis cache if needed
   - Check token expiration settings
