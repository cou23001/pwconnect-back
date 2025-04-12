// routes/groupRoutes.js
const express = require('express');
const router = express.Router();
const { getGroups, 
    getGroupById, 
    createGroup, updateGroup, deleteGroup, 
    getGroupsByWard,
    updateSession,
    getGroupSessions,
} = require('../controllers/groupController');
const { authenticate, authorize } = require('../middleware/authenticate');

// GET /groups
router.get('/groups', authenticate, authorize([10]), getGroups);

// GET /groups/:id
router.get('/groups/:id', authenticate, authorize([10]), getGroupById);

// GET /groups/ward/:wardId
router.get('/groups/ward/:wardId', authenticate, authorize([10]), getGroupsByWard);

// POST /groups
router.post('/groups', authenticate, authorize([10]), createGroup);

// PUT /groups/:id
router.put('/groups/:id', authenticate, authorize([10]), updateGroup);

// DELETE /groups/:id
router.delete('/groups/:id', authenticate, authorize([10]), deleteGroup);

// GET /groups/sessions
router.get('/groups/sessions/:groupId', authenticate, authorize([10]), getGroupSessions);

// PATCH /groups/sessions/:groupId/:sessionNumber
router.patch('/groups/sessions/:groupId/:sessionNumber', authenticate, authorize([10]), updateSession);

// Get All Sessions for a Group
router.get('/groups/sessions/:groupId', authenticate, authorize([10]), getGroupSessions);

module.exports = router;