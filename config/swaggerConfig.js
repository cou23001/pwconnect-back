// config/swaggerConfig.js
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Schemas
const userSchema = require('../schemas/user');
const userResponseSchema = require('../schemas/userResponse');
const tokenMetadataSchema = require('../schemas/tokenMetadata');
const wardSchema = require('../schemas/ward');
const stakeSchema = require('../schemas/stake');
const groupSchema = require('../schemas/group');
const instructorSchema = require('../schemas/instructor');
const addressSchema = require('../schemas/address');
const studentSchema = require('../schemas/student');
const attendanceSchema = require('../schemas/attendance');
const registrationSchema = require('../schemas/registration');
const termSchema = require('../schemas/term');

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
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      },
      schemas: {
        User: userSchema.User,
        UserResponse: userResponseSchema.UserResponse,
        TokenMetadata: tokenMetadataSchema.TokenMetadata,
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
    security: [{ bearerAuth: [] }]
  },
  apis: ['./controllers/*.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

const setupSwagger = (app) => {
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocs, {
      explorer: true,
      swaggerOptions: {
        withCredentials: true,
        requestInterceptor: (req) => {
          req.credentials = "include";
          return req;
        },
      },
    })
  );
};

module.exports = setupSwagger;
