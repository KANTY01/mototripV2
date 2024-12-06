# mototripV2
# MotoTrip

Welcome to **MotoTrip** - a comprehensive platform for motorcycle enthusiasts to plan, share, and join motorcycle trips. This service provides detailed trip announcements, allowing users to explore various routes and adventures. Each trip has unique information and is waiting for riders to join and create unforgettable memories.

## Table of Contents

1. [Features](#features)
2. [Technology Stack](#technology-stack)
3. [Database Design and Structure](#database-design-and-structure)
4. [Design Patterns](#design-patterns)
5. [Installation](#installation)
6. [Usage](#usage)
7. [Contributing](#contributing)
8. [License](#license)

## Features

- **Browse Trips:** Explore a wide range of motorcycle trip listings.
- **Detailed Trip Profiles:** Each trip comes with a detailed profile including route, description, date, and organizer information.
- **Advanced Search:** Filter searches based on trip type, location, and date to find your perfect adventure.
- **User Accounts:** Create your account to post trip announcements or to interact with existing listings.
- **Responsive Design:** Platform is fully responsive, making it easy to navigate on various devices.

## Technology Stack

Project is built using a variety of technologies and tools to ensure efficiency, performance, and scalability. Below is a list of the key components:

1. **Front-End:**
   - HTML, CSS: For structuring, styling, and client-side logic.

2. **Back-End:**
   - PHP: Primary server-side programming language.
   - PostgreSQL: Robust and scalable database management system.

3. **Server:**
   - Nginx: High-performance web server.

4. **Containerization:**
   - Docker: For creating, deploying, and running applications in containers.
   - Docker Compose: For defining and running multi-container Docker applications.

5. **Version Control:**
   - Git: For source code management.
   - GitHub: For hosting the repository and facilitating version control and collaboration.

## Database Design and Structure

The project includes a comprehensive design and structure for the database, ensuring efficient data storage and retrieval. Here are the key components:

1. **Entity-Relationship Diagram (ERD):**
   - The `erd.png` file in the main directory provides a visual representation of the database schema. This diagram is useful for understanding the relationships between different entities in the database.
   - [View ERD](./diagram erd.png)

2. **Database Schema:**
   - The `script.sql` file contains the SQL commands to create the database structure. It defines tables, relationships, and other database elements.
   - [View Database Script](./sql/quary.sql)

## Design Patterns

1. **MVC (Model-View-Controller)**
   - Separates the application into Model, View, and Controller components.
   - **Example:** `UserController.php`, `TripController.php`
2. **Singleton**
   - Ensures a class has only one instance and provides a global point of access to it.
   - **Example:** `Database.php`
3. **Repository**
   - Abstracts the data layer, providing a modular structure.
   - **Example:** `UserRepository.php`, `TripRepository.php`
4. **Dependency Injection**
   - Provides objects that an object requires instead of creating them directly.
   - **Example:** `ServiceContainer.php`
5. **Factory**
   - Creates objects without specifying the exact class of object that will be created.
   - **Example:** `TripFactory.php`

## Installation

Project is dockerized for easy setup and deployment. Follow these steps to get the project up and running:

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/yourusername/mototrip.git
   cd mototrip
   ```

2. **Docker Setup:**
   Ensure Docker and Docker Compose are installed on your system. 

3. **Build Docker Images:**
   ```bash
   docker-compose build
   ```

4. **Start Docker Containers:**
   ```bash
   docker-compose up
   ```

5. **Access the Application:**
   After the containers are up and running, you can access the application through your web browser at `http://localhost:8080`.

## Usage

### Home Page
The home page showcases the latest trips and provides links to key functionalities of the site such as browsing all trips, logging in, registering.

### All Trips View
This page allows users to browse all available motorcycle trips, with filtering options to help find the perfect trip.

### Trip View
This detailed view allows users to see full information about the trip, including route, descriptions, date, location, and contact details of the organizer.

### Login and Registration View
These pages allow users to create and manage their accounts, which is necessary for posting trips and using features that require authorization.

### Profile View
The profile view lets users manage their personal information, password, and avatar.

### My Trips View
Here, users can view their own posted trips.

## Contributing

I am always looking to improve "MotoTrip" and appreciate any feedback or contributions. If you would like to contribute, please feel free to fork the repository and submit a pull request.

## License

This project is licensed under the MIT License.
