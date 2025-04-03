// routes/studentRoutes.js
const express = require('express');
const { getAllStudents, getStudentById, createStudent, updateStudent, deleteStudent } = require('../controllers/studentController');
const { authenticate, authorize } = require('../middleware/authenticate');
const validateOwnership = require('../middleware/validateOwnership');
const router = express.Router();

// GET /students
router.get('/students', authenticate, authorize([10]), getAllStudents);

// GET /students/:id
// Route requires authentication and authorization for roles 1 and 10.
// It checks if the user owns the data (or is admin).
router.get('/students/:id', authenticate, authorize([1, 10]), validateOwnership, getStudentById);

// POST /students
router.post('/students', authenticate, createStudent);

// PUT /students/:id
// Route requires authentication and authorization for roles 1 and 10.
// It checks if the user owns the data (or is admin).
router.put('/students/:id', authenticate, authorize([1,10]), validateOwnership, updateStudent);

// DELETE /students/:id
// Route requires authentication and authorization for role 10 (admin).
router.delete('/students/:id', authenticate, authorize([10]), deleteStudent);

module.exports = router;