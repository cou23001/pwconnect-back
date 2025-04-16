# The English Connect Backend Admin

The English Connect Backend Admin is a backend system built with **Node.js** and **MongoDB** in the cloud. It provides authentication, user management, and administrative tools for the English Connect courses.

Backend production server: https://pwconnect-back.onrender.com/api-docs
Frontend production server: https://english-connect-admin.onrender.com/

## Features
- User authentication and JWT-based authorization
- Type-based access control (Admin, Instructor, and Student.)
- RESTful API for managing users and data
- Cloud-hosted MongoDB integration

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/cou23001/pwconnect-back.git
2. Navigate to the project folder:
   ```bash
    cd pwconnect-back
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

### Address
| Method | Endpoint             | Description              |
|--------|----------------------|--------------------------|
| GET    | /api/address         | Get all addresses        |
| POST   | /api/address         | Create a new address     |
| GET    | /api/address/{id}    | Get an address by ID     |
| PUT    | /api/address/{id}    | Update an address by ID  |
| DELETE | /api/address/{id}    | Delete an address by ID  |

### Attendance

| Method | Endpoint                         | Description                       |
|--------|----------------------------------|-----------------------------------|
| POST   | /api/attendance                  | Create a new Attendance record    |
| GET    | /api/attendance                  | Get all Attendance records        |
| GET    | /api/attendance/{id}             | Get Attendance record by ID       |
| PUT    | /api/attendance/{id}             | Update Attendance record by ID    |
| DELETE | /api/attendance/{id}             | Delete Attendance record by ID    |
| GET    | /api/attendance/group/{groupId}  | Get Attendances by Group ID       |


### Authentication
| Method | Endpoint                   | Description                         |
|--------|----------------------------|-------------------------------------|
| POST   | /api/auth/register         | Register a new user                 |
| POST   | /api/auth/login            | Login user                          |
| GET    | /api/auth/validate         | Validate access token               |
| POST   | /api/auth/refresh-token    | Refresh access and refresh token    |
| POST   | /api/auth/logout           | Logout user                         |
| GET    | /api/auth/profile          | Get user profile                    |

# Group

| Method | Endpoint                                           | Description                        |
|--------|----------------------------------------------------|------------------------------------|
| GET    | /api/groups                                        | Get a list of Groups               |
| POST   | /api/groups                                        | Create a new Group                 |
| GET    | /api/groups/{id}                                   | Get a Group by ID                  |
| PUT    | /api/groups/{id}                                   | Update a Group by ID               |
| DELETE | /api/groups/{id}                                   | Delete a Group by ID               |
| GET    | /api/groups/ward/{wardId}                          | Get Groups by Ward ID              |
| PATCH  | /api/groups/sessions/{groupId}/{sessionNumber}     | Update a session for a Group       |
| GET    | /api/groups/sessions/{groupId}                     | Get all sessions for a Group       |

# Instructor

| Method | Endpoint                                 | Description                                 |
|--------|------------------------------------------|---------------------------------------------|
| GET    | /api/instructors                         | Get a list of instructors with user details |
| POST   | /api/instructors                         | Create a new instructor                     |
| GET    | /api/instructors/{id}                    | Get an instructor by ID                     |
| PUT    | /api/instructors/{id}                    | Update an instructor by ID                  |
| DELETE | /api/instructors/{id}                    | Delete an instructor                        |
| GET    | /api/instructors/wards/{wardId}          | Get instructors by ward ID                  |
| PUT    | /api/instructors/upload/{id}             | Upload an avatar                            |

# Registration

| Method | Endpoint                                         | Description                              |
|--------|--------------------------------------------------|------------------------------------------|
| GET    | /api/registrations                               | Retrieve a list of registrations         |
| POST   | /api/registrations                               | Create a new registration                |
| GET    | /api/registrations/{id}                          | Retrieve a registration by ID            |
| PUT    | /api/registrations/{id}                          | Update a registration                    |
| DELETE | /api/registrations/{id}                          | Delete a registration                    |
| GET    | /api/registrations/group/{groupId}/students      | Get all students registered in a group   |


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
    git clone https://github.com/cou23001/pwconnect-back.git
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
