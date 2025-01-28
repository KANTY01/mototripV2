# Resetting Admin Credentials

This guide explains how to reset the admin credentials for the MotorTrip application.

## Default Admin Credentials

- Email: admin@motortrip.com
- Password: Admin123!

## How to Reset Admin Password

1. Navigate to the project's backend directory:
   ```bash
   cd backend
   ```

2. Run the password reset script:
   ```bash
   node scripts/reset-admin-password.cjs
   ```

The script will:
- Connect to the database
- Reset the admin password to the default value (Admin123!)
- Verify the new password works
- Display success/failure messages

## Requirements

Make sure you have the following installed:
- Node.js
- PostgreSQL running locally
- Required npm packages (bcrypt, pg)

## Troubleshooting

If you encounter any issues:

1. Ensure PostgreSQL is running and accessible
2. Check database connection settings in `.env` file
3. Make sure all required packages are installed:
   ```bash
   npm install pg bcrypt
   ```

## Security Note

It's recommended to change the admin password immediately after logging in with the default credentials for security purposes.
