# MotorTrip Backend User Guide

This guide will help you set up and run the MotorTrip backend server.

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn package manager

## Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone [repository-url]
   cd motortrip-final
   ```

2. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the `backend` directory with the following content:
   ```env
   NODE_ENV=development
   PORT=3000
   DATABASE_URL=postgres://postgres:postgres@localhost:5432/motortrip
   JWT_SECRET=your-development-secret-key
   ```
   Adjust the `DATABASE_URL` according to your PostgreSQL configuration.

4. **Database Setup**
   - Create a PostgreSQL database named 'motortrip'
   - Run migrations:
     ```bash
     npm run migrate
     ```
   - To undo migrations:
     ```bash
     npm run migrate:undo
     ```

5. **Build the Project**
   ```bash
   npm run build
   ```

6. **Start the Server**
   - For development with auto-reload:
     ```bash
     npm run dev
     ```
   - For production:
     ```bash
     npm start
     ```

## API Endpoints

### Public Endpoints
- `GET /` - API information and documentation
- `GET /api/trips/search` - Search available trips

### Protected Endpoints (Requires Authentication)
- `POST /api/trips` - Create a new trip
- `PUT /api/trips/:id` - Update a trip
- `DELETE /api/trips/:id` - Archive a trip
- `GET /api/reviews` - Access review endpoints

### Admin Endpoints (Requires Admin Role)
- `GET /api/admin/*` - Various admin operations

## Authentication

Protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer your-jwt-token
```

## Error Handling

The API returns standard HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

Error responses include a message and details (in development mode):
```json
{
  "error": "Error message",
  "stack": "Stack trace (development only)"
}
```

## Development Tips

1. **Watch Mode**
   The development server (`npm run dev`) automatically reloads when files change.

2. **Testing Database Connection**
   ```bash
   npm run test-db
   ```

3. **Running Tests**
   ```bash
   npm test              # Run all tests
   npm run test:watch    # Run tests in watch mode
   npm run test:cov      # Run tests with coverage
   ```

## Troubleshooting

1. **Database Connection Issues**
   - Verify PostgreSQL is running
   - Check DATABASE_URL in .env
   - Run `npm run test-db` to test connection

2. **Build Errors**
   - Clear the dist directory: `rm -rf dist`
   - Rebuild: `npm run build`

3. **Runtime Errors**
   - Check console for error messages
   - Verify all environment variables are set
   - Ensure database migrations are up to date


