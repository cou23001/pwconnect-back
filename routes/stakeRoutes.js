// routes/stakeRoutes.js
const express = require('express');
const router = express.Router();
const { getStakes, getStake, createStake, updateStake, deleteStake } = require('../controllers/stakeController');
const authenticate = require('../middleware/authenticate'); // Import the authenticate middleware

// GET /stakes
router.get('/stakes', authenticate, getStakes);

// GET /stakes/:id
router.get('/stakes/:id', authenticate, getStake);

// POST /stakes
router.post('/stakes', authenticate, createStake);

// PUT /stakes/:id
router.put('/stakes/:id', authenticate, updateStake);

// DELETE /stakes/:id
router.delete('/stakes/:id', authenticate, deleteStake);

module.exports = router;