// routes/tokenMetadataRoutes.js
const express = require('express');
const router = express.Router();
const { createTokenMetadata, getTokenMetadataById } = require('../controllers/tokenMetadataController');
const authenticate = require('../middleware/authenticate');

// Refresh token route
router.post('/token-metadata/', authenticate, createTokenMetadata);
router.get('/token-metadata/:id', authenticate, getTokenMetadataById);

module.exports = router;