// routes/registrationRoutes.js
const express = require('express');
const { getRegistrations, getRegistrationById, createRegistration, updateRegistration, deleteRegistration } = require('../controllers/registrationController');
const router = express.Router();

// GET /registrations
router.get('/registrations', getRegistrations);

// GET /registrations/:id
router.get('/registrations/:id', getRegistrationById);

// POST /registrations
router.post('/registrations', createRegistration);

// PUT /registrations/:id
router.put('/registrations/:id', updateRegistration);

// DELETE /registrations/:id
router.delete('/registrations/:id', deleteRegistration);

module.exports = router;