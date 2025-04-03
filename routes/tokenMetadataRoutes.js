// routes/tokenMetadataRoutes.js
const express = require('express');
const router = express.Router();
const { getTokenMetadataById } = require('../controllers/tokenMetadataController');
const { authenticate, authorize } = require('../middleware/authenticate');

// Get token metadata by ID
router.get('/token-metadata/:id', authenticate, authorize([10]),getTokenMetadataById);

module.exports = router;