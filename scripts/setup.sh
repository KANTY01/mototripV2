#!/bin/bash

# Navigate to the backend directory
cd backend

# Create a .env file if it doesn't exist
if [ ! -f .env ]; then
  echo "Creating .env file..."
  cp .env.example .env
fi

# Seed the database
echo "Seeding the database..."
npm run seed

echo "Database seeded successfully!"

# Navigate back to the project root
cd ..

echo "Setup completed successfully!"
