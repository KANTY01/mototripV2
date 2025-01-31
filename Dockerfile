# syntax=docker/dockerfile:1
FROM node:20-alpine AS build

# Set the working directory
WORKDIR /app

# Update npm to latest version
RUN npm install -g npm@11.1.0

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source files
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 3000
EXPOSE 3000

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
