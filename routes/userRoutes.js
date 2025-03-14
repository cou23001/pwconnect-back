const express = require('express');
const { getUsers, createUser, getUserById } = require('../controllers/userController');

const router = express.Router();

// GET /users
router.get('/users', getUsers);

// GET /users/:id
router.get('/users/:id', getUserById);

// POST /users
router.post('/users', createUser);

module.exports = router;