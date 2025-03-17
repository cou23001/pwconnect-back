const express = require('express');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const tokenMetadataRoutes = require('./routes/tokenMetadataRoutes');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const userSchema = require('./schemas/user');
const userResponseSchema = require('./schemas/userResponse');
const tokenMetadataSchema = require('./schemas/tokenMetadata');
const dotenv = require('dotenv');

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

module.exports = app;