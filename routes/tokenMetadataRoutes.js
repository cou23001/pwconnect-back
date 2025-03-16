// routes/tokenMetadataRoutes.js
const express = require('express');
const router = express.Router();
const { createRefreshToken, getRefreshTokenByEmail } = require('../controllers/tokenMetadataController');
const authenticate = require('../middleware/authenticate');

// Public routes
router.post('/refresh-token', createRefreshToken);

// Refresh token route
//router.post('/refresh-token', refreshToken);

router.get('/token-metadata/:email', getRefreshTokenByEmail);

module.exports = router;