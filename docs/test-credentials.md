# Test Credentials for MotorTrip Application

This document provides test credentials for different user roles in the MotorTrip application. Each role has different access levels and permissions.

## Available Roles

### 1. Admin User
```
Email: admin@motortrip.com
Password: Admin123!
```
**Access and Permissions:**
- Full access to admin dashboard
- Manage all users
- Manage all trips
- View audit logs
- System configuration

### 2. Regular User
```
Email: user@motortrip.com
Password: User123!
```
**Access and Permissions:**
- Create and manage own trips
- Book trips
- Write reviews
- Update personal profile

## Feature Access Matrix

| Feature                | Admin | User |
|-----------------------|-------|------|
| View Trips            | ✓     | ✓    |
| Create Trips          | ✓     | ✓    |
| Edit Any Trip         | ✓     | ✘    |
| Delete Any Trip       | ✓     | ✘    |
| Book Trips            | ✓     | ✓    |
| Write Reviews         | ✓     | ✓    |
| Access Admin Panel    | ✓     | ✘    |
| Manage Users          | ✓     | ✘    |
| View Audit Logs       | ✓     | ✘    |
| System Settings       | ✓     | ✘    |

## Notes

1. All passwords follow the security requirements:
   - Minimum 8 characters
   - At least one uppercase letter
   - At least one lowercase letter
   - At least one number
   - At least one special character

2. Current Implementation Status:
   - Basic authentication is implemented
   - Role-based access control is in place
   - Admin dashboard is partially implemented (60%)
   - Frontend integration is in progress (25%)

3. Testing Instructions:
   - Start the backend server: `cd backend && npm start`
   - Start the frontend: `cd frontend && npm run dev`
   - Access the application at http://localhost:3000
   - Use the credentials above to test different roles
