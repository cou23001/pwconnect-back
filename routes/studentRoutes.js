// routes/studentRoutes.js
const express = require('express');
const { getAllStudents, getStudentById, createStudent, updateStudent, deleteStudent } = require('../controllers/studentController');
const authenticate = require('../middleware/authenticate');
const router = express.Router();

// GET /students
router.get('/students', authenticate, getAllStudents);

// GET /students/:id
router.get('/students/:id', authenticate, getStudentById);

// POST /students
router.post('/students', authenticate, createStudent);

// PUT /students/:id
router.put('/students/:id', authenticate, updateStudent);

// DELETE /students/:id
router.delete('/students/:id', authenticate, deleteStudent);

module.exports = router;