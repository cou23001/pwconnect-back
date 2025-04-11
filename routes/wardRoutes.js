// routes/wardRoutes.js
const express = require('express');
const router = express.Router();
const { getWards, getWardById, createWard, updateWard, deleteWard } = require('../controllers/wardController');
const { authorize, authenticate } = require('../middleware/authenticate');

// GET /wards
router.get('/wards', authenticate, authorize([10]), getWards);

// GET /wards/:id
router.get('/wards/:id', authenticate, authorize([10]), getWardById);

// POST /wards
router.post('/wards', authenticate, authorize([10]), createWard);

// PUT /wards/:id
router.put('/wards/:id', authenticate, authorize([10]), updateWard);

// DELETE /wards/:id
router.delete('/wards/:id', authenticate, authorize([10]), deleteWard);

module.exports = router;