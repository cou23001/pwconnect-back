// routes/attendanceRoutes.js
const express = require('express');
const router = express.Router();
const {
  createAttendance,
  getAttendances,
  getAttendance,
  getAttendanceByGroup,
  updateAttendance,
  deleteAttendance,
} = require('../controllers/attendanceController');
const { authenticate } = require('../middleware/authenticate');

// POST /attendance
router.post('/attendance', authenticate, createAttendance);

// GET /attendance
router.get('/attendance', authenticate, getAttendances);

// GET /attendance/:id
router.get('/attendance/:id', authenticate, getAttendance);

// GET /attendance/:groupId
router.get('/attendance/group/:groupId', authenticate, getAttendanceByGroup);

// PUT /attendance/:id
router.put('/attendance/:id', authenticate, updateAttendance);

// DELETE /attendance/:id
router.delete('/attendance/:id', authenticate, deleteAttendance);

module.exports = router;