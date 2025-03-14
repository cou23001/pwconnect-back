const express = require('express');
const userRoutes = require('./routes/userRoutes');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const userSchema = require('./schemas/userio');
const userResponseSchema = require('./schemas/userioResponse');
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

module.exports = app;