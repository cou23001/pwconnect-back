// routes/groupRoutes.js
const express = require('express');
const router = express.Router();
const { getGroupSessionsByStake, getGroupStudentCountsByStake, getGroupAttendanceByStake } = require('../controllers/statController');
const { authenticate, authorize } = require('../middleware/authenticate');

// GET /api/stats/stake/:stakeId/groups-sessions
router.get('/stats/stake/:stakeId/groups-sessions', authenticate, authorize([10]), getGroupSessionsByStake);

//GET /api/stats/stake/:stakeId/group-students
router.get('/stats/stake/:stakeId/group-students', authenticate, authorize([10]), getGroupStudentCountsByStake);

// GET /api/stats/stake/:stakeId/group-attendance
router.get('/stats/stake/:stakeId/group-attendance', authenticate, authorize([10]), getGroupAttendanceByStake);


module.exports = router;