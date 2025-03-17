//routes/userPermissionRoutes.js
const express = require('express');
const router = express.Router();
const { getPermissions, getPermissionById, createPermission, updatePermission, deletePermission } = require('../controllers/userPermissionController');
const authenticate = require('../middleware/authenticate');

// GET /permissions
router.get('/permissions', authenticate, getPermissions);

// GET /permissions/:id
router.get('/permissions/:id', authenticate, getPermissionById);

// POST /permissions
router.post('/permissions', authenticate, createPermission);

// PUT /permissions/:id
router.put('/permissions/:id', authenticate, updatePermission);

// DELETE /permissions/:id
router.delete('/permissions/:id', authenticate, deletePermission);

module.exports = router;