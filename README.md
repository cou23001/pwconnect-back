# The Pathway Connect Backend Admin

The Pathway Connect Backend Admin is a backend system built with **Node.js** and **MongoDB** in the cloud. It provides authentication, user management, and administrative tools.

## Features
- User authentication and JWT-based authorization
- Role-based access control (Admin, User, etc.)
- RESTful API for managing users and data
- Cloud-hosted MongoDB integration

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/pathway-connect-backend-admin.git
2. Navigate to the project folder:
   ```bash
    cd pathway-connect-backend-admin
3. Install dependencies:
    ```bash
    npm install
4. Create a .env file in the root directory and add the following:
    ```bash
    MONGO_URI=your-mongodb-cloud-url
    JWT_SECRET=your-secret-key
    PORT=5000
5. Start the server
    ```bash
    npm start

## API Endpoints

### Authentication
| Method | Endpoint            | Description             |
|--------|---------------------|-------------------------|
| POST   | `/api/auth/login`   | Admin login            |
| POST   | `/api/auth/register` | Register a new admin  |

### User Management
| Method | Endpoint            | Description                  |
|--------|---------------------|------------------------------|
| GET    | `/api/users`        | Retrieve all users           |
| GET    | `/api/users/:id`    | Get a single user by ID      |
| POST   | `/api/users`        | Create a new user            |
| PUT    | `/api/users/:id`    | Update user details          |
| DELETE | `/api/users/:id`    | Delete a user                |

### Additional Endpoints (if needed)
| Method | Endpoint                | Description                   |
|--------|-------------------------|-------------------------------|
| GET    | `/api/dashboard/stats`  | Retrieve system statistics    |
| GET    | `/api/logs`             | Get system logs               |

