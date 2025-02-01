#!/bin/sh

# Wait for 5 seconds to ensure Redis is ready
echo "Waiting for Redis to start..."
sleep 5

# Create necessary directories
mkdir -p /app/database
mkdir -p /app/uploads
chmod 777 /app/database
chmod 777 /app/uploads

# Run migrations
echo "Running database migrations..."
node sequelize-cli-wrapper.js runMigrations

# Run seeders
echo "Running database seeders..."
node sequelize-cli-wrapper.js runSeeders

# Start the application
echo "Starting the application..."
node src/index.js