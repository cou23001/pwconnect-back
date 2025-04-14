// middleware/authenticate.js
const { verifyAccessToken } = require('../config/jwt');
const User = require('../models/user');

// Middleware to authenticate users
function authenticate(req, res, next) {
  // 1. Extract token from header
  const token = req.headers.authorization?.split(' ')[1];
  
  // 2. Reject if no token
  if (!token) {
    return res.status(401).json({ error: 'Authorization token required' });
  }

  // 3. Verify token
  try {
    req.user = verifyAccessToken(token); // Attach decoded user
    next(); // Proceed if valid
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// Middleware to authorize users based on their type
function authorize(types = []) {
  return async (req, res, next) => {
    try {
      // 1. Check if user is authenticated
      if (!req.user?._id) {
        return res.status(401).json({ message: "Authentication required" });
      }
      // 1. Check if user exists in the database by ObjectId
      const user = await User.findById(req.user._id);
      
      if (!user) {
        return res.status(403).json({ message: "User doesn't exist" });
      }

      if (!types.includes(user.type)) {
        return res.status(403).json({ message: "Unauthorized access" });
      }

      next();
    } catch (error) {
      return res.status(500).json({ message: "Authorization check failed" });
    }
  };
}

module.exports = {
  authenticate,
  authorize,
};