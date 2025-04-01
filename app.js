const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
//const dotenv = require('dotenv');
const cors = require('cors');

// Routes
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const tokenMetadataRoutes = require('./routes/tokenMetadataRoutes');
const userRoleRoutes = require('./routes/userRoleRoutes');
const wardRoutes = require('./routes/wardRoutes');
const stakeRoutes = require('./routes/stakeRoutes');
const groupRoutes = require('./routes/groupRoutes');
const instructorRoutes = require('./routes/instructorRoutes');
const addressRoutes = require('./routes/addressRoutes');
const termRoutes = require('./routes/termRoutes');
const studentRoutes = require('./routes/studentRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const registrationRoutes = require('./routes/registrationRoutes');

// Schemas
const userSchema = require('./schemas/user');
const userResponseSchema = require('./schemas/userResponse');
const tokenMetadataSchema = require('./schemas/tokenMetadata');
const userRoleSchema = require('./schemas/userRole');
const wardSchema = require('./schemas/ward');
const stakeSchema = require('./schemas/stake');
const termSchema = require('./schemas/term');
const instructorSchema = require('./schemas/instructor');
const addressSchema = require('./schemas/address');
const studentSchema = require('./schemas/student');
const groupSchema = require('./schemas/group');
const attendanceSchema = require('./schemas/attendance');
const registrationSchema = require('./schemas/registration');

// Load environment variables
require('dotenv').config(); 

// Clear existing env variables to avoid conflicts
const dotenv = require('dotenv');

if (process.env.NODE_ENV === 'development') {
    dotenv.config({ path: '.env', override: true });
  } else {
    dotenv.config({ path: '.env.production', override: true });
}

const app = express();
app.use(cors({
  origin: process.env.SWAGGER_SERVER_URL,
  credentials: true
}));


// Swagger configuration
const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'EnglishConnect Admin API',
        version: '1.0.0',
        description: 'API for managing EnglishConnect students',
      },
      servers: [
        {
          url: process.env.SWAGGER_SERVER_URL,
          description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Local server',
        },
      ],
      components: {
        schemas: {
          User: userSchema.User,
          UserResponse: userResponseSchema.UserResponse,
          TokenMetadata: tokenMetadataSchema.TokenMetadata,
          UserRole: userRoleSchema.UserRole,
          Ward: wardSchema.Ward,
          Stake: stakeSchema.Stake,
          Group: groupSchema.Group,
          Term: termSchema.Term,
          Instructor: instructorSchema.Instructor,
          Address: addressSchema.Address,
          Student: studentSchema.Student,
          Attendance: attendanceSchema.Attendance,
          Registration: registrationSchema.Registration
        },
      },
    },
    apis: ['./controllers/*.js'], // Path to your controller files
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Middleware
app.use(express.json()); // Parse JSON request bodies

// Routes
app.use('/api', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', tokenMetadataRoutes);
app.use('/api', userRoleRoutes);
app.use('/api', wardRoutes);
app.use('/api', stakeRoutes);
app.use('/api', groupRoutes);
app.use('/api', instructorRoutes);
app.use('/api', termRoutes);
app.use('/api', addressRoutes);
app.use('/api', studentRoutes);
app.use('/api', attendanceRoutes);
app.use('/api', registrationRoutes)

module.exports = app;