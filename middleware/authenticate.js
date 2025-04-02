// middleware/authenticate.js
const { verifyAccessToken } = require('../config/jwt');

const authenticate = (req, res, next) => {
  // Get the token from the Authorization header
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(403).json({ error: 'Forbidden: No token provided' });
  }

  // Remove the "Bearer " prefix to get the actual token
  const token = authHeader.split(' ')[1]; // Split by space and take the second part

  // Verify the token
  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded; // Attach the user payload to the request
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(403).json({ error: 'Forbidden: Invalid token' });
  }
};

module.exports = authenticate;