// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { register, login, profile } = require('../controllers/authController');
const authenticate = require('../middleware/authenticate');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected route
router.get('/profile', authenticate, profile);

module.exports = router;