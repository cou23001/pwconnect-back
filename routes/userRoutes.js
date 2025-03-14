const express = require('express');
const { getUsers, createUser, getUserById, deleteUser } = require('../controllers/userController');

const router = express.Router();

// GET /users
router.get('/users', getUsers);

// GET /users/:id
router.get('/users/:id', getUserById);

// POST /users
router.post('/users', createUser);

// DELETE /users/:id
router.delete('/users/:id', deleteUser);

module.exports = router;