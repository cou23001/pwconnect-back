// routes/groupRoutes.js
const express = require('express');
const router = express.Router();
const { getGroups, getGroup, createGroup, updateGroup, deleteGroup } = require('../controllers/groupController');
const authenticate = require('../middleware/authenticate');

// GET /groups
router.get('/groups', getGroups);

// GET /groups/:id
router.get('/groups/:id', getGroup);

// POST /groups
router.post('/groups', createGroup);

// PUT /groups/:id
router.put('/groups/:id', updateGroup);

// DELETE /groups/:id
router.delete('/groups/:id', deleteGroup);

module.exports = router;