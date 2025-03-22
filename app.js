const express = require('express');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const userPermissionRoutes = require('./routes/userPermissionRoutes');
const tokenMetadataRoutes = require('./routes/tokenMetadataRoutes');
const userRoleRoutes = require('./routes/userRoleRoutes');
const wardRoutes = require('./routes/wardRoutes');
const stakeRoutes = require('./routes/stakeRoutes');
const groupRoutes = require('./routes/groupRoutes');
const instructorRoutes = require('./routes/instructorRoutes');
const addressRoutes = require('./routes/addressRoutes');
const termRoutes = require('./routes/termRoutes');
const studentRoutes = require('./routes/studentRoutes');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const userSchema = require('./schemas/user');
const userResponseSchema = require('./schemas/userResponse');
const tokenMetadataSchema = require('./schemas/tokenMetadata');
const userPermissionSchema = require('./schemas/userPermission');
const userRoleSchema = require('./schemas/userRole');
const wardSchema = require('./schemas/ward');
const stakeSchema = require('./schemas/stake');
const termSchema = require('./schemas/term');
const instructorSchema = require('./schemas/instructor');
const addressSchema = require('./schemas/address');
const studentSchema = require('./schemas/student');
const dotenv = require('dotenv');
const userRole = require('./schemas/userRole');
const groupSchema = require('./schemas/group');
const { Student } = require('./schemas/student');
const student = require('./schemas/student');

// Load environment variables
if (process.env.NODE_ENV === 'production') {
    dotenv.config({ path: '.env.production' });
  } else {
    dotenv.config({ path: '.env' });
}

const app = express();

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
          UserPermission: userPermissionSchema.UserPermission,
          UserRole: userRoleSchema.UserRole,
          Ward: wardSchema.Ward,
          Stake: stakeSchema.Stake,
          Group: groupSchema.Group,
          Term: termSchema.Term,
          Instructor: instructorSchema.Instructor,
          Address: addressSchema.Address,
          Student: studentSchema.Student
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
app.use('/api', userPermissionRoutes)
app.use('/api', userRoleRoutes);
app.use('/api', wardRoutes);
app.use('/api', stakeRoutes);
app.use('/api', groupRoutes);
app.use('/api', instructorRoutes);
app.use('/api', termRoutes);
app.use('/api', addressRoutes);
app.use('/api', studentRoutes);

module.exports = app;