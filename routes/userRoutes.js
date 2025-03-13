const express = require('express');
const { getUsers, createUser } = require('../controllers/userController');

const router = express.Router();

// GET /users
router.get('/users', getUsers);

// POST /users
router.post('/users', createUser);

module.exports = router;