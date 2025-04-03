// config/jwt.js
const jwt = require('jsonwebtoken');

// Generate an access token
const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, type: user.type }, // Payload
    process.env.JWT_SECRET, // Secret key
    { expiresIn: process.env.JWT_EXPIRATION } // Access token expiration (e.g., '15m')
  );
};

// Generate a refresh token
const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id }, // Payload (minimal data for security)
    process.env.JWT_REFRESH_SECRET, // Refresh token secret
    { expiresIn: process.env.JWT_REFRESH_EXPIRATION } // Refresh token expiration (e.g., '7d')
  );
};

// Verify an access token
const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

// Verify a refresh token
const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};



module.exports = { 
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken
};
