// routes/stakeRoutes.js
const express = require('express');
const router = express.Router();
const { getStakes, getStakeById, createStake, updateStake, deleteStake, getWardsInStake, getStakesByCountry } = require('../controllers/stakeController');
const { authenticate, authorize } = require('../middleware/authenticate');

// GET /stakes
router.get('/stakes', authenticate, authorize([10]), getStakes);

// GET /stakes/:id
router.get('/stakes/:id', authenticate, authorize([10]), getStakeById);

// POST /stakes
router.post('/stakes', authenticate, authorize([10]), createStake);

// PUT /stakes/:id
router.put('/stakes/:id', authenticate, authorize([10]), updateStake);

// DELETE /stakes/:id
router.delete('/stakes/:id', authenticate, authorize([10]), deleteStake);

// GET /stakes/wards/:id
// This route retrieves all wards in a specific stake
router.get('/stakes/wards/:id', authenticate, authorize([10]), getWardsInStake);

// GET /stakes/country/:countryName
// This route retrieves all stakes in a specific country
router.get('/stakes/country/:countryName', authenticate, authorize([10]), getStakesByCountry);

module.exports = router;