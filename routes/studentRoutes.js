// routes/studentRoutes.js
const express = require('express');
const { getAllStudents, getStudentById, createStudent, updateStudent, deleteStudent } = require('../controllers/studentController');
const authenticate = require('../middleware/authenticate');
const router = express.Router();

// GET /students
router.get('/students', authenticate('read'), getAllStudents);

// GET /students/:id
// Allow all users with 'read' permission (students & instructors)
router.get('/students/:id', authenticate('read','false','false','true'), getStudentById);

// POST /students
// Allow only users with 'create' permission (instructors & admins)
router.post('/students', authenticate('create','false', 'true'), createStudent);

// PUT /students/:id
// Allow only users with 'update' permission (instructors & admins)
router.put('/students/:id', authenticate('update','false','false','true'), updateStudent);

// DELETE /students/:id
// Allow only users with 'delete' permission (admins)
router.delete('/students/:id', authenticate('delete','false','true'), deleteStudent);

module.exports = router;