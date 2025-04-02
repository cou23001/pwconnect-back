// routes/instructorRoutes.js
const express = require('express');
const { getInstructors, createInstructor, getInstructorById, updateInstructor, deleteInstructor } = require('../controllers/instructorController');
const authenticate = require('../middleware/authenticate');
const router = express.Router();

// GET /instructors
router.get('/instructors', getInstructors);

// GET /instructors/:id
router.get('/instructors/:id', getInstructorById);

// POST /instructors
router.post('/instructors', createInstructor);

// PUT /instructors/:id
router.put('/instructors/:id', updateInstructor);

// DELETE /instructors/:id
router.delete('/instructors/:id', deleteInstructor);


module.exports = router;