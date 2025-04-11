// routes/termRoutes.js
const express = require('express');
const { getTerms, createTerm, getTermById, updateTerm, deleteTerm } = require('../controllers/termController');
const { authenticate, authorize } = require('../middleware/authenticate');

const router = express.Router();

// GET /terms
router.get('/terms', authenticate, authorize([10]), getTerms);

// GET /terms/:id
router.get('/terms/:id', authenticate, authorize([10]), getTermById);

// POST /terms
router.post('/terms', authenticate, authorize([10]), createTerm);

// PUT /terms/:id
router.put('/terms/:id', authenticate, authorize([10]), updateTerm);

// DELETE /terms/:id
router.delete('/terms/:id', authenticate, authorize([10]), deleteTerm);

module.exports = router;