const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const setupSwagger = require('./config/swaggerConfig');
const routes = require('./routes/index'); 

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

// Use all routes from the routes file
app.use(routes);

module.exports = app;