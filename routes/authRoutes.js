// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { register, login, profile, refreshToken, logout } = require('../controllers/authController');
const authenticate = require('../middleware/authenticate');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Refresh token route
router.post('/refresh-token', refreshToken);

// Protected route
router.get('/profile', authenticate(), profile);
router.post('/logout', authenticate(), logout);

module.exports = router;