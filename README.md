# Motorcycle Trip Platform

The Motorcycle Trip Platform is a comprehensive web application designed for motorcycle enthusiasts to plan, share, and discover exciting motorcycle trips.

## Description

This web application helps riders organize and document their motorcycle adventures by providing features such as:

- Creating and managing motorcycle trips.
- Uploading trip images and details.
- Tracking trip difficulty levels and distances.
- Social sharing and engagement with other riders.
- Reviewing and rating trips.
- Admin management for content and users.

The platform is flexible and can be adapted for other outdoor adventure activities.

---

## Features

### For Riders

- **Trip Management**: Create, edit, and remove trips.
- **Trip Sharing**: Share trips with the community.
- **Review System**: Rate and review trips with photos.
- **User Profiles**: View and manage basic user profiles.

### For Premium Users

- **Exclusive Trip Access**: Unlock premium trips and routes.
- **Advanced Trip Details**: Access enhanced trip insights.

### For Admins

- **User Management**: Moderate and manage platform users.
- **Content Moderation**: Oversee trip submissions and reviews.

---

## Screenshots

### Trip Dashboard
![image](https://github.com/user-attachments/assets/0b0692a1-f1a1-4cf7-8b0d-cf9c3b092a01)

### Trip Details Page
![image](https://github.com/user-attachments/assets/a89c0603-e59c-468a-ab69-246e0f2e657e)

### User Profile
![image](https://github.com/user-attachments/assets/4a779f80-cb35-42ac-8e96-32953dd09c03)

### Admin Dashboard
![image](https://github.com/user-attachments/assets/e5a7f72b-6c34-4740-8f44-73aa1b28bc83)

### Review System
![image](https://github.com/user-attachments/assets/ab525259-dd69-4882-bcba-e477706d056d)

---

## Setup Instructions

### Prerequisites

- **Node.js**: Version 18 or later.
- **Docker**: For containerized deployment.
- **Redis**: For session and caching management.
- **SQLite/PostgreSQL**: As the database backend.

### Steps to Run the Application

1. **Clone the Repository**

   ```bash
   git clone https://github.com/KANTY01/mototripV2.git
   cd mototrip
   ```

2. **Start the Backend**

   - Install dependencies:
     ```bash
     cd backend
     npm install
     ```
   - Start the development server:
     ```bash
     npm run dev
     ```

3. **Start the Frontend**

   - Navigate to the frontend directory:
     ```bash
     cd frontend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Run the React development server:
     ```bash
     npm start
     ```

4. **Run with Docker (Alternative)**

   ```bash
   docker-compose up --build
   ```

5. **Access the Application**

   - **Frontend**: [http://localhost:3000/](http://localhost:3000/)
   - **Backend API**: [http://localhost:5000/](http://localhost:5000/)
   - **Swagger UI**: [http://localhost:5000/api-docs](http://localhost:5000/api-docs)

---

## Future Enhancements

- **Live Trip Tracking**
- **Enhanced Social Features**
- **Mobile App Development**
- **More Premium Content and Subscriptions**

---

## Contact

For further details or collaboration, feel free to reach out!

##Accounts

# Admin
- Email: admin@motorcycletrip.com
- Password: admin123
- Role: admin
- Access: Content management and moderation functions

# Regular Users
These users have basic access to create trips, write reviews, and follow other users.

| Email | Password | Username |
|-------|----------|----------|
| user1@example.com | user1pass | rider1_* |
| user2@example.com | user2pass | rider2_* |
| user3@example.com | user3pass | rider3_* |

