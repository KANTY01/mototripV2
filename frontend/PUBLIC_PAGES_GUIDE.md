# Development Mode with Public Pages Guide

This guide explains how to use the development mode that completely bypasses all authentication and authorization.

## Quick Start

```bash
# From the frontend directory
./make_public_script && npm run dev

# To verify all protected routes
./check_protected_routes
```

## What It Does

The development mode modifies three key components to ensure complete access:

1. **Route Protection** (ProtectedRoute.tsx)
   - Bypasses all authentication checks
   - Skips role-based access control
   - Allows direct access to all routes

2. **API Authentication** (axiosConfig.ts)
   - Provides automatic dev token
   - Bypasses API authentication errors
   - Returns success responses for auth failures

3. **Authentication State** (authSlice.ts)
   - Provides permanent authenticated state
   - Sets up admin user with all privileges
   - Prevents logout/authentication changes

## Protected Routes

The following routes should be accessible in development mode:

1. User Routes:
   - `/profile` - User profile page
   - `/profile/edit` - Profile editing page

2. Admin Routes:
   - `/admin` - Admin dashboard
   - `/admin/statistics` - Statistics page
   - `/admin/trips` - Trip management
   - `/admin/users` - User management

3. Premium Routes:
   - `/trips/:id/premium` - Premium trip content

## Verifying Access

Use the provided route checking script:
```bash
./check_protected_routes
```

This script will:
1. Verify the development server is running
2. Open each protected route in your browser
3. Allow you to check each page's content
4. Guide you through all protected routes systematically

If any route fails to load:
1. Check browser console for errors
2. Verify development mode is enabled
3. Clear browser storage
4. Restart the development server

## Default Development User

When in development mode, you're automatically logged in as:
```typescript
{
  id: 999999,
  email: 'dev@example.com',
  username: 'DevAdmin',
  role: 'admin',
  experience_level: 'expert'
  // Additional profile data included
}
```

## How to Use

1. Enable development mode:
   ```bash
   ./make_public_script
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Verify all routes are accessible:
   ```bash
   ./check_protected_routes
   ```

## Troubleshooting

If routes are not accessible:

1. Clear browser storage:
   - Local Storage
   - Session Storage
   - Cookies

2. Restart the development server:
   ```bash
   npm run dev
   ```

3. Re-apply development mode:
   ```bash
   ./make_public_script
   ```

4. Check browser console for errors

5. Verify all files are modified:
   - src/components/common/ProtectedRoute.tsx
   - src/api/axiosConfig.ts
   - src/store/slices/authSlice.ts

## File Backups

The script automatically creates backups:
- *.orig files are created before modifications
- Original files can be restored using:
  ```bash
  ./make_public_script -r
  ```

## Security Warning

⚠️ IMPORTANT:
- This mode completely disables all security
- Use for local development ONLY
- Never commit modified files
- Never use in production
- Keep backups until development is complete

## Technical Details

The system works through three layers:

1. **Route Level**
   - ProtectedRoute component bypasses all checks
   - Returns children directly without auth verification

2. **API Level**
   - Adds dev token to all requests
   - Converts auth errors to success responses
   - Prevents unauthorized API responses

3. **State Level**
   - Maintains permanent admin auth state
   - Prevents state changes (login/logout)
   - Provides necessary user data

## Best Practices

1. Only enable when actively developing protected features
2. Use check_protected_routes to verify access
3. Don't push modified files to version control
4. Restore original files when done:
   ```bash
   ./make_public_script -r
   ```
5. Test with real authentication before committing
6. Keep backups until development is complete