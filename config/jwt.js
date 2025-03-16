// config/jwt.js
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email }, // Payload
    process.env.JWT_SECRET, // Secret key
    { expiresIn: process.env.JWT_EXPIRATION } // Token expiration
  );
};

const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { generateToken, verifyToken };