// routes/termRoutes.js
const express = require('express');
const { getTerms, createTerm, getTermById, updateTerm, deleteTerm } = require('../controllers/termController');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

// GET /terms
router.get('/terms', authenticate, getTerms);

// GET /terms/:id
router.get('/terms/:id', getTermById);

// POST /terms
router.post('/terms', createTerm);

// PUT /terms/:id
router.put('/terms/:id', updateTerm);

// DELETE /terms/:id
router.delete('/terms/:id', deleteTerm);

module.exports = router;