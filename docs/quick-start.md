# MotorTrip Quick Start Guide

This guide will help you quickly set up and run the MotorTrip application on your system.

## Prerequisites

- Linux-based operating system
- Sudo privileges
- Internet connection

## Installation

1. Clone or extract the project to your desired location:
```bash
git clone [repository-url] motortrip
cd motortrip
```

2. Make scripts executable:
```bash
chmod +x scripts/*.sh
```

3. Run the backend setup script (requires sudo):
```bash
sudo ./scripts/setup-backend.sh
```
This script will:
- Install required packages (PostgreSQL, Redis, Node.js)
- Configure the database
- Set up environment variables
- Install dependencies
- Run migrations and seed data

4. Run the frontend setup script:
```bash
./scripts/setup-frontend.sh
```
This script will:
- Set up environment variables
- Install dependencies
- Build the project

## Configuration

### Backend Configuration
The backend `.env` file is automatically created with default values. If you need to modify any settings:
```bash
nano backend/.env
```

Default configuration:
```
PORT=4000
DATABASE_URL=postgres://barbatos:barbatos@127.0.0.1:5432/motortrip_dev
REDIS_URL=redis://localhost:6379
```

### Frontend Configuration
The frontend `.env` file is created with default values. You'll need to add your Google Maps API key:
```bash
nano frontend/.env
```

Required configuration:
```
VITE_API_URL=http://localhost:4000/api
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

## Running the Application

1. Start the backend server:
```bash
./scripts/start-backend.sh
```
The backend will run on http://localhost:4000

2. In a new terminal, start the frontend server:
```bash
./scripts/start-frontend.sh
```
The frontend will run on http://localhost:3000

## Default Credentials

After setup, you can log in with these default credentials:

Regular User:
- Email: user@motortrip.com
- Password: User123!

Admin User:
- Email: admin@motortrip.com
- Password: Admin123!

## Troubleshooting

### Backend Issues

1. If services aren't running:
```bash
sudo systemctl start postgresql
sudo systemctl start redis-server
```

2. If database connection fails:
```bash
sudo -u postgres psql -c "ALTER USER barbatos WITH PASSWORD 'barbatos';"
```

3. To reset the database:
```bash
cd backend
npm run migrate:undo:all
npm run migrate
node scripts/temp-seed.mjs
```

### Frontend Issues

1. If dependencies are missing:
```bash
cd frontend
rm -rf node_modules
npm install
```

2. If build fails:
```bash
cd frontend
npm run build
```

3. If the application can't connect to the backend:
- Verify the backend is running
- Check that VITE_API_URL in frontend/.env points to the correct backend URL

## Support

For additional help or to report issues, please refer to:
- Full documentation in the `docs/` directory
- Project repository issues section
- Contact the development team

## Security Note

The default credentials and database password are for development purposes only. In a production environment, you should:
1. Change all default passwords
2. Use secure JWT secrets
3. Enable HTTPS
4. Configure proper firewall rules
