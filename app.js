const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const setupSwagger = require('./config/swaggerConfig');

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

// Middleware to log the client IP address
app.use((req, res, next) => {
  const clientIp = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;
  // Store client IP in request for later use
  req.clientIp = clientIp;
  next();  // Pass control to the next middleware or route handler
});

// Swagger setup
setupSwagger(app);

// Middleware
app.use(express.json()); // Parse JSON request bodies
// Cookie parser middleware
app.use(cookieParser()); // This enables `req.cookies`

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