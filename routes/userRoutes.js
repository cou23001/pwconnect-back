const express = require('express');
const { getUsers, createUser, getUserById, deleteUser, updateUser } = require('../controllers/userController');

const router = express.Router();

// GET /users
router.get('/users', getUsers);

// GET /users/:id
router.get('/users/:id', getUserById);

// POST /users
router.post('/users', createUser);

// PUT /users/:id
router.put('/users/:id', updateUser);

// DELETE /users/:id
router.delete('/users/:id', deleteUser);

module.exports = router;