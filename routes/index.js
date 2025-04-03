// routes/index.js
const express = require('express');

// Import your route files
const userRoutes = require('./userRoutes');
const authRoutes = require('./authRoutes');
const tokenMetadataRoutes = require('./tokenMetadataRoutes');
const wardRoutes = require('./wardRoutes');
const stakeRoutes = require('./stakeRoutes');
const groupRoutes = require('./groupRoutes');
const instructorRoutes = require('./instructorRoutes');
const addressRoutes = require('./addressRoutes');
const termRoutes = require('./termRoutes');
const studentRoutes = require('./studentRoutes');
const attendanceRoutes = require('./attendanceRoutes');
const registrationRoutes = require('./registrationRoutes');

const router = express.Router();

// Combine all the routes
router.use('/api/auth', authRoutes);
router.use('/api', userRoutes);
router.use('/api', tokenMetadataRoutes);
router.use('/api', wardRoutes);
router.use('/api', stakeRoutes);
router.use('/api', groupRoutes);
router.use('/api', instructorRoutes);
router.use('/api', termRoutes);
router.use('/api', addressRoutes);
router.use('/api', studentRoutes);
router.use('/api', attendanceRoutes);
router.use('/api', registrationRoutes);

module.exports = router;
