# Motorcycle Trip Platform Setup Guide

This comprehensive guide covers both Docker-based deployment and local development setup for the Motorcycle Trip Platform.

## Prerequisites

### Docker Deployment
- Docker Engine (20.10.x or later)
- Docker Compose (v2.x or later)
- Git (2.x or later)
- 4GB RAM minimum
- 10GB free disk space

### Local Development
- Node.js (v18.x or later)
- npm (v9.x or later)
- Redis (v7.x or later)
- Git (2.x or later)
- SQLite (v3.x or later)

## Initial Setup

1. **Clone the Repository:**
   ```bash
   git clone <repository-url>
   cd motorcycle-trip-platform
   ```

2. **Environment Configuration:**
   ```bash
   # Backend environment setup
   cd backend
   cp .env.example .env
   
   # Frontend environment setup
   cd ../frontend
   cp .env.example .env
   ```

   Update the following key variables:
   - Backend `.env`:
     ```
     JWT_SECRET=<your-secure-secret>
     REDIS_URL=redis://redis:6379
     NODE_ENV=development
     PORT=5000
     ```
   - Frontend `.env`:
     ```
     VITE_API_URL=http://localhost:5000/api
     VITE_GOOGLE_MAPS_KEY=<your-google-maps-api-key>
     ```

## Docker Deployment

1. **Build and Start Services:**
   ```bash
   docker-compose up --build
   ```

2. **Initialize Database:**
   ```bash
   # Run migrations
   docker-compose exec backend npx sequelize-cli db:migrate

   # Seed initial data
   docker-compose exec backend npx sequelize-cli db:seed:all
   ```

3. **Verify Deployment:**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:5000](http://localhost:5000)
   - API Documentation: [http://localhost:5000/api-docs](http://localhost:5000/api-docs)

## Local Development Setup

1. **Install Dependencies:**
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

2. **Database Setup:**
   ```bash
   cd ../backend
   
   # Run migrations
   npx sequelize-cli db:migrate

   # Seed database
   npx sequelize-cli db:seed:all
   ```

3. **Start Redis Server:**
   ```bash
   # Linux/Mac
   sudo service redis-server start
   # or
   redis-server

   # Verify Redis connection
   redis-cli ping  # Should return PONG
   ```

4. **Run Development Servers:**
   ```bash
   # Terminal 1: Start backend
   cd backend
   npm run dev

   # Terminal 2: Start frontend
   cd frontend
   npm run dev
   ```

## Testing Environment

1. **Run Tests:**
   ```bash
   # Backend tests
   cd backend
   npm test
   npm run test:coverage

   # Frontend tests
   cd frontend
   npm test
   npm run test:coverage
   ```

2. **Linting and Type Checking:**
   ```bash
   # Backend
   cd backend
   npm run lint
   npm run lint:fix

   # Frontend
   cd frontend
   npm run lint
   npm run type-check
   ```

## Account Types and Access

### Default Test Accounts:

1. **Super Admin**
   - Email: `superadmin@example.com`
   - Password: `superadminpass`
   - Access: Full system access, user management, analytics

2. **Admin**
   - Email: `admin@example.com`
   - Password: `adminpassword`
   - Access: Content management, user moderation

3. **Premium User**
   - Email: `premium@example.com`
   - Password: `premiumpassword`
   - Access: All premium features

4. **Regular User**
   - Email: `user@example.com`
   - Password: `userpassword`
   - Access: Basic features

## Troubleshooting

### Common Issues

1. **Port Conflicts:**
   ```bash
   # Check ports in use
   lsof -i :3000  # Frontend
   lsof -i :5000  # Backend
   lsof -i :6379  # Redis

   # Kill process using port
   kill -9 <PID>
   ```

2. **Database Issues:**
   ```bash
   # Reset database
   cd backend
   rm database/database.db
   npx sequelize-cli db:migrate
   npx sequelize-cli db:seed:all
   ```

3. **Redis Connection Issues:**
   ```bash
   # Restart Redis
   sudo service redis-server restart

   # Clear Redis cache
   redis-cli FLUSHALL
   ```

4. **Docker Issues:**
   ```bash
   # Complete reset
   docker-compose down
   docker system prune -af
   docker volume prune -f
   docker-compose up --build
   ```

### Development Tips

1. **Hot Reloading:**
   - Backend uses `nodemon` for auto-reloading
   - Frontend uses Vite's hot module replacement (HMR)

2. **Debugging:**
   ```bash
   # Backend debugging
   cd backend
   NODE_ENV=development DEBUG=* node src/index.js

   # Frontend debugging in Chrome
   google-chrome --auto-open-devtools-for-tabs http://localhost:3000
   ```

3. **Log Access:**
   ```bash
   # Docker logs
   docker-compose logs -f backend
   docker-compose logs -f frontend

   # Development logs
   cd backend
   npm run dev | tee debug.log
   ```

## Production Deployment

1. **Database Migration:**
   - Switch to PostgreSQL or MySQL
   - Update database configuration
   - Run migrations in production

2. **Security Measures:**
   - Enable HTTPS
   - Set secure cookie options
   - Configure CORS properly
   - Use environment variables
   - Implement rate limiting

3. **Performance Optimization:**
   - Enable compression
   - Configure caching headers
   - Use a CDN for static assets
   - Enable server-side rendering

4. **Monitoring:**
   - Set up application monitoring
   - Configure error tracking
   - Enable performance metrics
   - Implement logging

For more detailed troubleshooting steps, refer to our [TROUBLESHOOTING.md](TROUBLESHOOTING.md) guide.
