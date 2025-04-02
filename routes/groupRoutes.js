// routes/groupRoutes.js
const express = require('express');
const router = express.Router();
const { getGroups, getGroup, createGroup, updateGroup, deleteGroup } = require('../controllers/groupController');
const authenticate = require('../middleware/authenticate');

// GET /groups
router.get('/groups', authenticate(), getGroups);

// GET /groups/:id
router.get('/groups/:id', authenticate(), getGroup);

// POST /groups
router.post('/groups', authenticate(), createGroup);

// PUT /groups/:id
router.put('/groups/:id', authenticate(), updateGroup);

// DELETE /groups/:id
router.delete('/groups/:id', authenticate(), deleteGroup);

module.exports = router;