// routes/termRoutes.js
const express = require('express');
const { getTerms, createTerm, getTermById, updateTerm, deleteTerm } = require('../controllers/termController');
const { authenticate } = require('../middleware/authenticate');

const router = express.Router();

// GET /terms
router.get('/terms', authenticate, getTerms);

// GET /terms/:id
router.get('/terms/:id', authenticate, getTermById);

// POST /terms
router.post('/terms', authenticate, createTerm);

// PUT /terms/:id
router.put('/terms/:id', authenticate, updateTerm);

// DELETE /terms/:id
router.delete('/terms/:id', authenticate, deleteTerm);

module.exports = router;