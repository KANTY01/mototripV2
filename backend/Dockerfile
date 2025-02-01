# Use Node.js 20 image with npm 11
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Update npm to latest version
RUN npm install -g npm@11.1.0

# Install build dependencies
RUN apk add --no-cache python3 python3-dev py3-pip make g++ git \
    && pip3 install --break-system-packages setuptools wheel

# Copy package files
COPY backend/package*.json ./

# Install dependencies
RUN npm ci --only=production

# Create uploads directory
RUN mkdir -p uploads && chmod 777 uploads

# Copy backend application code
COPY backend/src/ ./src/
COPY backend/migrations/ ./migrations/
COPY backend/seeders/ ./seeders/
COPY backend/scripts/initialize.sh ./scripts/
COPY backend/sequelize-cli-wrapper.js ./
COPY backend/.env* ./

# Create SQLite database directory with proper permissions
RUN mkdir -p database && chmod 777 database

# Expose the port that the application will run on
EXPOSE 5000

# Make initialization script executable
RUN chmod +x ./scripts/initialize.sh

# Use initialization script as entry point
CMD ["./scripts/initialize.sh"]
