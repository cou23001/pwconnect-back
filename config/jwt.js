// config/jwt.js
const jwt = require('jsonwebtoken');
const getCountry = require("../utils/getCountry");


// Generate an access token
const generateAccessToken = (user) => {
  const location =  user.wardId?.stakeId?.location;
  let country = null;
  if (location) {
    country = getCountry(location);
  }

  return jwt.sign(
    { _id: user._id, email: user.email, type: user.type, stakeId: user.wardId?.stakeId?._id ?? null, country: country }, // Payload
    process.env.JWT_SECRET, // Secret key
    { expiresIn: process.env.JWT_EXPIRATION } // Access token expiration (e.g., '15m')
  );
};

// Generate a refresh token
const generateRefreshToken = (user) => {
  return jwt.sign(
    { _id: user.id }, // Payload (minimal data for security)
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
