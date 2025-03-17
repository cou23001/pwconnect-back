// routes/tokenMetadataRoutes.js
const express = require('express');
const router = express.Router();
const { createTokenMetadata, getTokenMetadataByEmail } = require('../controllers/tokenMetadataController');

// Refresh token route
router.post('/refresh-tokens', createTokenMetadata);
router.get('/token-metadata/:email', getTokenMetadataByEmail);

module.exports = router;