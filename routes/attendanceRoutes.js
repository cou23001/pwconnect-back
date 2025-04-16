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
  getAttendanceByGroupByStake,
} = require('../controllers/attendanceController');
const { authenticate, authorize } = require('../middleware/authenticate');

// POST /attendance
router.post('/attendance', authenticate, authorize([10,11]), createAttendance);

// GET /attendance
router.get('/attendance', authenticate, authorize([10,11]), getAttendances);

// GET /attendance/:id
router.get('/attendance/:id', authenticate, authorize([10,11]), getAttendance);

// GET /attendance/group/:groupId
router.get('/attendance/group/:groupId', authenticate, authorize([10,11]), getAttendanceByGroup);

// GET //attendance/stake/:stakeId
router.get('/attendance/stake/:stakeId', authenticate, authorize([10,11]), getAttendanceByGroupByStake);

// PUT /attendance/:id
router.put('/attendance/:id', authenticate, authorize([10,11]), updateAttendance);

// DELETE /attendance/:id
router.delete('/attendance/:id', authenticate, authorize([10,11]), deleteAttendance);

module.exports = router;