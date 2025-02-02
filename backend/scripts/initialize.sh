#!/bin/sh

# Exit on any error
set -e

echo "Starting initialization..."

# Function to check if Redis is running
check_redis() {
    redis-cli ping > /dev/null 2>&1
    return $?
}

# Check if Redis is already running
echo "Checking Redis status..."
if check_redis; then
    echo "Redis is already running"
else
    echo "Redis is not running, starting Redis server..."
    redis-server &
    # Wait for Redis to be ready
    for i in $(seq 1 30); do
        if check_redis; then
            echo "Redis is now ready"
            break
        fi
        if [ $i -eq 30 ]; then
            echo "Redis failed to start"
            exit 1
        fi
        echo "Waiting for Redis... ($i/30)"
        sleep 1
    done
fi

# Create necessary directories
echo "Creating necessary directories..."
mkdir -p database
mkdir -p uploads
mkdir -p ../gallery  # Add gallery directory relative to backend

# Set permissions
echo "Setting directory permissions..."
chmod 777 database
chmod 777 uploads
chmod 777 ../gallery

# Create placeholder images in gallery if empty
echo "Setting up gallery..."
if [ -z "$(ls -A ../gallery)" ]; then
    echo "Gallery empty, creating placeholder images..."
    for i in $(seq 1 10); do
        echo "Placeholder image $i" > "../gallery/image_$i.webp"
    done
fi

# Run migrations
echo "Running database migrations..."
if ! node sequelize-cli-wrapper.js runMigrations; then
    echo "Migration failed!"
    exit 1
fi

# Run seeders
echo "Running database seeders..."
if ! node sequelize-cli-wrapper.js runSeeders; then
    echo "Seeding failed!"
    exit 1
fi

echo "Initialization complete! Starting the application..."
exec node src/index.js
