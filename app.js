// app.js
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const setupSwagger = require('./config/swaggerConfig');
const routes = require('./routes/index');
const BACKEND_PROD_URL = process.env.BACKEND_PROD_URL;
const BACKEND_DEV_URL = process.env.BACKEND_DEV_URL;

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

const allowedOrigins = [
  BACKEND_PROD_URL, // Backend production URL
  BACKEND_DEV_URL, // Backend development URL      
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS: ' + origin));
    }
  },
  credentials: true,
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
app.use(cookieParser());

// Use all routes from the routes file
app.use(routes);

module.exports = app;