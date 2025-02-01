# Stage 1: Build the frontend application
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files from frontend directory
COPY frontend/package*.json ./

RUN npm install
RUN npm install -g typescript

# Copy frontend source files
COPY frontend/ ./
RUN npm run build

# Stage 2: Serve the frontend application using nginx
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

# Configure nginx
COPY frontend/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
