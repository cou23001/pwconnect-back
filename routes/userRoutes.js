const express = require('express');
const { getUsers, getUserById, deleteUser, updateUser } = require('../controllers/userController');
const { authenticate, authorize } = require('../middleware/authenticate');

const router = express.Router();

// GET /users
router.get('/users', authorize([10]), authenticate, getUsers);

// GET /users/:id
router.get('/users/:id', authorize([10]), authenticate, getUserById);

// PUT /users/:id
router.put('/users/:id', authorize([10]), authenticate, updateUser);

// DELETE /users/:id
router.delete('/users/:id', authorize([10]), authenticate, deleteUser);

module.exports = router;