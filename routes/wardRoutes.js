// routes/wardRoutes.js
const express = require('express');
const router = express.Router();
const { getWards, getWard, createWard, updateWard, deleteWard } = require('../controllers/wardController');
const authenticate = require('../middleware/authenticate');

// GET /wards
router.get('/wards', authenticate, getWards);

// GET /wards/:id
router.get('/wards/:id', authenticate, getWard);

// POST /wards
router.post('/wards', authenticate, createWard);

// PUT /wards/:id
router.put('/wards/:id', authenticate, updateWard);

// DELETE /wards/:id
router.delete('/wards/:id', authenticate, deleteWard);

module.exports = router;