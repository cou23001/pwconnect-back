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
   git clone https://github.com/yourusername/pwconnect-back.git
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

### Additional Endpoints
| Method | Endpoint                | Description                   |
|--------|-------------------------|-------------------------------|
| GET    | `/api/dashboard/stats`  | Retrieve system statistics    |
| GET    | `/api/logs`             | Get system logs               |

### License

This project is licensed under the MIT License. See the LICENSE file for details.

### Support

If you encounter any issues or have questions, feel free to open an issue on the GitHub repository.

### Usage

- Make sure your MongoDB database is running.
- Use Postman or cURL to test API endpoints.
- Admin users can manage other users via the API.

### Technologies Used

- Node.js - JavaScript runtime
- Express.js - Web framework for Node.js
- MongoDB - NoSQL database
- Mongoose - ODM for MongoDB
- JWT - Authentication mechanism

### Contributing

1. Fork the repository.
2. Clone your forked repository to your local machine:
    ```bash
    git clone https://github.com/your-username/pwconnect-back.git
3. Create a new branch for your feature or bugfix:
    ```bash
    git checkout -b feature/your-feature-name
4. Make your changes and commit them with a descriptive message:
    ```bash
    git commit -m "Add your commit message here"
5. Push your changes to your forked repository:
    ```bash
    git push origin feature/your-feature-name
6. Open a Pull Request on the original repository and describe your changes.
    

### License

This project is licensed under the MIT License.