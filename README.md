# The English Connect Backend Admin

The English Connect Backend Admin is a backend system built with **Node.js** and **MongoDB** in the cloud. It provides authentication, user management, and administrative tools for the English Connect courses.

- Backend production server: https://pwconnect-back.onrender.com/api-docs
- Frontend production server: https://english-connect-admin.onrender.com

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

### Group

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

---

## Student

| Method | Endpoint                                         | Description                                      |
|--------|--------------------------------------------------|--------------------------------------------------|
| GET    | /api/students                                    | Get all students with user and address information |
| POST   | /api/students                                    | Create a new student                             |
| GET    | /api/students/{id}                               | Get a student by ID                              |
| PUT    | /api/students/{id}                               | Update a student by ID                           |
| DELETE | /api/students/{id}                               | Delete a student by ID                           |
| GET    | /api/students/ward/{wardId}                      | Get students by Ward ID (via User relationship)  |
| PUT    | /api/students/upload/{id}                        | Upload an avatar                                 |
| GET    | /api/students/user/{userId}                      | Get a student by user ID                         |
| PUT    | /api/students/{studentId}/address                | Update a student's address ID                    |
| GET    | /api/students/{userId}/attendance                | Get attendance records for a student             |


### Instructor

| Method | Endpoint                                 | Description                                 |
|--------|------------------------------------------|---------------------------------------------|
| GET    | /api/instructors                         | Get a list of instructors with user details |
| POST   | /api/instructors                         | Create a new instructor                     |
| GET    | /api/instructors/{id}                    | Get an instructor by ID                     |
| PUT    | /api/instructors/{id}                    | Update an instructor by ID                  |
| DELETE | /api/instructors/{id}                    | Delete an instructor                        |
| GET    | /api/instructors/wards/{wardId}          | Get instructors by ward ID                  |
| PUT    | /api/instructors/upload/{id}             | Upload an avatar                            |

### Registration

| Method | Endpoint                                         | Description                              |
|--------|--------------------------------------------------|------------------------------------------|
| GET    | /api/registrations                               | Retrieve a list of registrations         |
| POST   | /api/registrations                               | Create a new registration                |
| GET    | /api/registrations/{id}                          | Retrieve a registration by ID            |
| PUT    | /api/registrations/{id}                          | Update a registration                    |
| DELETE | /api/registrations/{id}                          | Delete a registration                    |
| GET    | /api/registrations/group/{groupId}/students      | Get all students registered in a group   |

### Stake

| Method | Endpoint                                  | Description                         |
|--------|-------------------------------------------|-------------------------------------|
| GET    | /api/stakes                               | Get a list of stakes                |
| POST   | /api/stakes                               | Create a new stake                  |
| GET    | /api/stakes/country/{countryName}         | Get a list of stakes by country     |
| GET    | /api/stakes/{id}                          | Get a stake by ID                   |
| PUT    | /api/stakes/{id}                          | Update a stake by ID                |
| DELETE | /api/stakes/{id}                          | Delete a stake by ID                |
| GET    | /api/stakes/wards/{id}                    | Get a list of wards in a stake      |

---

### Term

| Method | Endpoint                         | Description                         |
|--------|----------------------------------|-------------------------------------|
| GET    | /api/terms                        | Get a list of terms                 |
| POST   | /api/terms                        | Create a new term                   |
| GET    | /api/terms/{id}                   | Get a term by ID                    |
| PUT    | /api/terms/{id}                   | Update a term                       |
| DELETE | /api/terms/{id}                   | Delete a term                       |


### Token Metadata

| Method | Endpoint                           | Description                                  |
|--------|------------------------------------|----------------------------------------------|
| GET    | /api/token-metadata/{id}           | Get token metadata by ID (validates refresh token) |

### User

| Method | Endpoint                           | Description                               |
|--------|------------------------------------|-------------------------------------------|
| GET    | /api/users                          | Get a list of users                       |
| GET    | /api/users/admin                    | Get a list of admin users                 |
| GET    | /api/users/{id}                     | Get a user by ID                          |
| PUT    | /api/users/{id}                     | Update a user by ID                       |
| DELETE | /api/users/{id}                     | Delete a user by ID                       |
| GET    | /api/users/wards/{wardId}           | Get users by ward ID                      |

### Ward

| Method | Endpoint                                 | Description                             |
|--------|------------------------------------------|-----------------------------------------|
| GET    | /api/instructors/wards/{wardId}          | Get instructors by ward ID              |
| GET    | /api/users/wards/{wardId}                | Get users by ward ID                    |
| GET    | /api/wards                                | Get a list of wards                     |
| POST   | /api/wards                               | Create a new ward                       |
| GET    | /api/wards/{id}                          | Get a ward by ID                        |
| PUT    | /api/wards/{id}                          | Update a ward by ID                     |
| DELETE | /api/wards/{id}                          | Delete a ward by ID                     |

### Statistics

| Method | Endpoint                                          | Description                                            |
|--------|---------------------------------------------------|--------------------------------------------------------|
| GET    | /stats/stake/{stakeId}/groups-sessions            | Get all group sessions for a specific stake            |
| GET    | /stats/stake/{stakeId}/group-students             | Get student counts for all groups in a specific stake  |
| GET    | /stats/stake/{stakeId}/group-attendance           | Get attendance statistics for all groups in a specific stake |


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
