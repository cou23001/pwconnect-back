// routes/instructorRoutes.js
const express = require('express');
const { getInstructors, createInstructor, getInstructorById, updateInstructor, deleteInstructor } = require('../controllers/instructorController');
const { authenticate, authorize } = require('../middleware/authenticate');
const router = express.Router();

// GET /instructors
router.get('/instructors', authenticate, authorize([10]), getInstructors);

// GET /instructors/:id
router.get('/instructors/:id', authenticate, authorize([10]), getInstructorById);

// POST /instructors
router.post('/instructors', authenticate, authorize([10]), createInstructor);

// PUT /instructors/:id
router.put('/instructors/:id', authenticate, authorize([10]), updateInstructor);

// DELETE /instructors/:id
router.delete('/instructors/:id', authenticate, authorize([10]), deleteInstructor);


module.exports = router;