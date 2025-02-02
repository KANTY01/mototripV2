# Motorcycle Trip Platform

## Overview

The Motorcycle Trip Platform is a comprehensive web application designed for motorcycle enthusiasts to plan, share, and discover exciting motorcycle trips.

## Core Features

### User Management
- **Authentication & Authorization** (Implemented)
  - JWT-based authentication
  - Role-based access control (User, Premium, Admin)
  - Session management with Redis

### Trip Management
- **Basic Trip Features** (Implemented)
  - Create and manage trips
  - Upload trip images
  - Basic trip details (title, description, dates)
  - Difficulty levels
  - Distance tracking

- **Trip Details** (Basic Implementation)
  - Image support
  - Basic trip descriptions
  - Start and end dates

### Social Features (Partially Implemented)
- **Basic Social Features**
  - View other users' trips
  - Basic user profiles
  - Trip sharing capabilities

### Premium Features (Basic Implementation)
- **Access Control**
  - Premium trip flagging
  - Basic premium content access
  - Premium route access control

### Reviews & Ratings (Implemented)
- **Quality Assurance**
  - Basic trip ratings and reviews
  - Photo reviews
  - Review status tracking
  - Content moderation system
  - Review reporting (Database Ready)
  - Review voting system (In Progress)

### Admin Dashboard (Basic Implementation)
- **Platform Management**
  - Basic user management
  - Content moderation
  - Trip management
  - Review moderation

## Technical Features

### Performance
- **Caching System** (Implemented)
  - Redis caching for trips
  - Basic browser caching
  - Static asset caching

- **Optimization**
  - Basic image handling
  - Pagination implementation
  - Query optimization

### Security (Basic Implementation)
- **Current Features**
  - JWT token security
  - Basic CORS configuration
  - Password hashing with bcrypt
  - Role-based access control

### Mobile Support
- **Responsive Design**
  - Basic mobile-friendly interface
  - Responsive layouts

## Technology Stack

### Frontend
- React with TypeScript
- Redux Toolkit for state management
- Material-UI components
- Axios for API communication
- React Router for navigation

### Backend
- Node.js and Express
- Sequelize ORM
- SQLite database
- Redis for caching
- JWT authentication

### DevOps
- Docker containerization
- Docker Compose orchestration

## Getting Started

1. **Prerequisites**
   - Node.js (v18 or later)
   - npm (v9 or later)
   - Docker and Docker Compose
   - Redis
   - Git

2. **Quick Start**
   ```bash
   # Clone repository
   git clone <repository-url>
   cd motorcycle-trip-platform

   # Start with Docker
   docker-compose up --build
   ```

3. **Access Points**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - API Docs: http://localhost:5000/api-docs
   - Admin Dashboard: http://localhost:3000/admin

For detailed setup instructions, see [SETUP_GUIDE.md](SETUP_GUIDE.md).

## Documentation

- [Architecture Guide](ARCHITECTURE.md)
- [API Documentation](http://localhost:5000/api-docs)
- [Database Schema](erd.md)
- [Setup Guide](SETUP_GUIDE.md)
- [Troubleshooting](TROUBLESHOOTING.md)
- [Commands Help](commands-help.md)
- [Docker Setup](DOCKER_SETUP_PROMPT.md)

## Development

### Local Development
```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

### Testing
Note: Testing packages are installed but not implemented
```bash
# Testing infrastructure is ready but tests need to be written
npm run test
```

### Code Quality
```bash
# Linting
npm run lint

# Type checking
npm run type-check
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Support

For support and troubleshooting:
1. Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
2. Review [commands-help.md](commands-help.md)
3. Submit an issue

## License

This project is licensed under the MIT License.
