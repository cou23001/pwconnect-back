// routes/addressRoutes.js
const express = require('express');
const { getAllAddresses, getAddressById, createAddress, updateAddress, deleteAddress } = require('../controllers/addressController');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

// GET /address
router.get('/address', authenticate, getAllAddresses);

// GET /address/:id
router.get('/address/:id', authenticate, getAddressById);

// POST /address
router.post('/address', authenticate, createAddress);

// PUT /address/:id
router.put('/address/:id', authenticate, updateAddress);

// DELETE /address/:id
router.delete('/address/:id', authenticate, deleteAddress);

module.exports = router;