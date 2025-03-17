// routes/userRoleRoutes.js
const express = require('express');
const router = express.Router();
const { getRoles, getRole, createRole, updateRole, deleteRole } = require('../controllers/userRoleController');
const authenticate = require('../middleware/authenticate');

// GET /roles
router.get('/roles', authenticate, getRoles);

// GET /roles/:id
router.get('/roles/:id', authenticate, getRole);

// POST /roles
router.post('/roles', authenticate, createRole);

// PUT /roles/:id
router.put('/roles/:id', authenticate, updateRole);

// DELETE /roles/:id
router.delete('/roles/:id', authenticate, deleteRole);

module.exports = router;
