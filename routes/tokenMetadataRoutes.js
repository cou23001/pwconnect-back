// routes/tokenMetadataRoutes.js
const express = require('express');
const router = express.Router();
const { getTokenMetadataById } = require('../controllers/tokenMetadataController');
const authenticate = require('../middleware/authenticate');

// Get token metadata by ID
router.get('/token-metadata/:id', authenticate, getTokenMetadataById);

module.exports = router;