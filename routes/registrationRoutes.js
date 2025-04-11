// routes/registrationRoutes.js
const express = require('express');
const { getRegistrations, getRegistrationById, createRegistration, updateRegistration, deleteRegistration, getStudentsByGroupId } = require('../controllers/registrationController');
const { authorize, authenticate } = require('../middleware/authenticate');

const router = express.Router();

// GET /registrations
router.get('/registrations', authenticate, authorize([10]), getRegistrations);

// GET /registrations/:id
router.get('/registrations/:id', authenticate, authorize([10]), getRegistrationById);

// GET /registrations/group/:groupId/students
router.get('/registrations/group/:groupId/students', authenticate, authorize([10]), getStudentsByGroupId);

// POST /registrations
router.post('/registrations', authenticate, authorize([10]), createRegistration);

// PUT /registrations/:id
router.put('/registrations/:id', authenticate, authorize([10]), updateRegistration);

// DELETE /registrations/:id
router.delete('/registrations/:id', authenticate, authorize([10]), deleteRegistration);

module.exports = router;