# Motorcycle Trip Platform

## Overview

The Motorcycle Trip Platform is a comprehensive web application designed for motorcycle enthusiasts to plan, share, and discover exciting motorcycle trips. With features ranging from social networking to route planning, and a premium subscription model, the platform creates an engaging community for riders.

## Core Features

### User Management
- **Authentication & Authorization**
  - Secure JWT-based authentication
  - Role-based access control (User, Premium, Admin, SuperAdmin)
  - Social authentication options
  - Session management with Redis

### Trip Management
- **Route Planning**
  - Interactive map interface
  - Route optimization
  - Distance and duration calculation
  - Waypoint management
  - Elevation profiles
  - Route difficulty assessment

- **Trip Details**
  - Rich media support (images, videos)
  - Detailed trip descriptions
  - Weather information
  - Points of interest
  - Road condition updates
  - Real-time traffic integration

### Social Features
- **Community Engagement**
  - Follow/unfollow users
  - Personalized activity feed
  - Trip sharing capabilities
  - Social interactions (likes, comments)
  - User reputation system

- **Profiles & Achievements**
  - Customizable user profiles
  - Experience level tracking
  - Achievement system
  - Riding statistics
  - Trip history
  - Contribution badges

### Premium Features
- **Enhanced Experience**
  - Exclusive premium routes
  - Advanced route planning tools
  - Offline route access
  - Premium trip templates
  - Priority support
  - Ad-free experience

- **Subscription Management**
  - Flexible subscription plans
  - Payment processing
  - Subscription status tracking
  - Auto-renewal handling
  - Premium feature access control

### Reviews & Ratings
- **Quality Assurance**
  - Trip ratings and reviews
  - Photo reviews
  - Verified rider badges
  - Helpful review voting
  - Review moderation system

### Admin Dashboard
- **Platform Management**
  - User management
  - Content moderation
  - Analytics dashboard
  - System health monitoring
  - Subscription tracking
  - Report handling

## Technical Features

### Performance
- **Caching System**
  - Redis caching implementation
  - Browser caching optimization
  - Static asset caching
  - Query result caching

- **Optimization**
  - Lazy loading
  - Image optimization
  - Code splitting
  - Performance monitoring

### Security
- **Data Protection**
  - HTTPS encryption
  - JWT token security
  - Rate limiting
  - Input validation
  - XSS protection
  - CSRF prevention

### Mobile Support
- **Responsive Design**
  - Mobile-first approach
  - Touch-friendly interface
  - Offline capabilities
  - Progressive Web App (PWA)

## Technology Stack

### Frontend
- React with TypeScript
- Redux Toolkit for state management
- Material-UI components
- Google Maps integration
- Axios for API communication
- React Router for navigation

### Backend
- Node.js and Express
- Sequelize ORM
- SQLite (dev) / PostgreSQL (prod)
- Redis for caching
- JWT authentication
- WebSocket support

### DevOps
- Docker containerization
- Docker Compose orchestration
- Automated testing
- CI/CD pipeline
- Monitoring tools

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
```bash
# Run backend tests
cd backend
npm test

# Run frontend tests
cd frontend
npm test
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
