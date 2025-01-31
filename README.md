# Motorcycle Trip Platform

## Overview

The Motorcycle Trip Platform is a web application designed for motorcycle enthusiasts to plan, discover, and share exciting motorcycle trips. Users can create their own trip routes, browse trips created by others, and connect with fellow riders. The platform also offers social features, premium content for subscribed users, and an admin dashboard for managing the application.

## Features

-   **User Authentication:**
    -   Secure user registration and login
    -   JWT-based authentication
-   **Trip Management:**
    -   Create, view, update, and delete trips
    -   Filter trips by difficulty, distance, location, and date
    -   View trip details, including route maps and images
-   **Profile Management:**
    -   View and edit user profiles
    -   Upload and update profile pictures
    -   Display user achievements
-   **Social Features:**
    -   Follow and unfollow other users
    -   View a personalized feed of trips from followed users
-   **Premium Content:**
    -   Access exclusive premium trips with a subscription
    -   Subscription management for users
-   **Reviews and Ratings:**
    -   Rate and review trips
    -   View average ratings and reviews for each trip
-   **Achievements:**
    -   Earn achievements for completing trips, writing reviews, and other activities
-   **Admin Dashboard:**
    -   Manage users, trips, and reviews
    -   View application statistics
-   **Image Uploads:**
    -   Upload images for trips and user avatars
-   **Map Integration:**
    -   View trip routes on an interactive map
-   **Caching:**
    -   Redis integration for caching frequently accessed data
-   **Responsive Design:**
    -   Mobile-friendly and responsive UI

## Technology Stack

-   **Frontend:**
    -   React
    -   Redux Toolkit (for state management)
    -   Material UI (for UI components)
    -   Axios (for API communication)
    -   React Router (for routing)
    -   Google Maps API (for map integration)
-   **Backend:**
    -   Node.js
    -   Express.js (for REST API)
    -   Sequelize (as ORM)
    -   SQLite (for development database)
    -   JWT (for authentication)
    -   Multer (for file uploads)
    -   Redis (for caching)
    -   Swagger (for API documentation)
-   **Deployment:**
    -   Docker
    -   Docker Compose

## Prerequisites

-   Node.js (v18 or later)
-   npm (v9 or later)
-   Docker
-   Docker Compose
-   Git

## Setup Instructions

1. **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd motorcycle-trip-platform
    ```

2. **Backend Setup:**

    -   Navigate to the `backend` directory:
        ```bash
        cd backend
        ```
    -   Install dependencies:
        ```bash
        npm install
        ```
    -   Create a `.env` file from the `.env.example` template and update the environment variables as needed.
    -   Run database migrations:
        ```bash
        npx sequelize-cli db:migrate
        ```
    -   Seed the database with initial data:
        ```bash
        npm run seed
        ```

3. **Frontend Setup:**

    -   Navigate to the `frontend` directory:
        ```bash
        cd ../frontend
        ```
    -   Install dependencies:
        ```bash
        npm install
        ```
    -   Create a `.env` file and set the `VITE_API_URL` variable to point to your backend API (e.g., `VITE_API_URL=http://localhost:5000/api`).

4. **Run the Application with Docker Compose:**

    -   Navigate back to the project root directory:
        ```bash
        cd ..
        ```
    -   Start the application:
        ```bash
        docker-compose up --build
        ```

5. **Access the Application:**

    The application will be available at the following URLs:
    ```
    Frontend: http://localhost:3000
    Backend API: http://localhost:5000
    API Documentation: http://localhost:5000/api-docs
    ```

## Default Credentials

After running the seed script, the following test accounts are available:

1. **Admin User**
   - Email: admin@example.com
   - Password: adminpassword
   - Role: Administrator
   - Features: Full access to admin dashboard and all platform features

2. **Premium User**
   - Email: premium@example.com
   - Password: premiumpassword
   - Role: Premium User
   - Features: Access to premium content, all basic features

3. **Regular User**
   - Email: user@example.com
   - Password: userpassword
   - Role: Basic User
   - Features: Access to basic platform features

You can use any of these accounts to test different aspects of the application:
- Use the admin account to access the admin dashboard
- Use the premium account to access premium content
- Use the regular user account to test basic features

## Database Schema

An Entity Relationship Diagram (ERD) is available in the `erd.md` file in the project root.

## API Documentation

The API documentation is generated using Swagger and is available at [http://localhost:5000/api-docs](http://localhost:5000/api-docs) when the application is running.

## Architecture

The application follows a monolithic architecture with a React frontend and a Node.js/Express backend. The backend uses Sequelize ORM to interact with the database and Redis for caching. The frontend communicates with the backend through a REST API.

For more details, see the `ARCHITECTURE.md` file in the project root.

## Testing

The project includes unit and integration tests for the backend API. To run the tests:

```bash
cd backend
npm test
```

## Deployment

The application is containerized using Docker and can be deployed using Docker Compose. For production deployments, it's recommended to use a more robust database system (e.g., PostgreSQL, MySQL) and a container orchestration platform (e.g., Kubernetes).

## Contributing

Contributions are welcome! Please create a pull request with your proposed changes.

## License

This project is licensed under the MIT License.
