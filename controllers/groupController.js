// controllers/groupController.js
const Group = require('../models/group');
const mongoose = require('mongoose');
const Instructor = require('../models/instructor');
const Ward = require('../models/ward');
const { groupSchema, groupUpdateSchema } = require('../validators/group');
const { updateSessionSchema } = require('../validators/session');

/**
 * @swagger
 * tags:
 *   name: Groups
 *   description: Group management
 */

// Get all Groups
/**
 * @swagger
 * /api/groups:
 *   get:
 *     summary: Get a list of Groups
 *     tags: [Groups]
 *     responses:
 *       200:
 *         description: A list of Groups
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Group'
 *       204:
 *         description: No Groups found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No Groups found
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */
const getGroups = async (req, res) => {
  try {
    const groups = await Group.find();
    if (groups.length === 0) {
      return res.status(204).send(); // No Content
    }
    res.status(200).json({ groups });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a Group by ID
/**
 * @swagger
 * /api/groups/{id}:
 *   get:
 *     summary: Get a Group by ID
 *     description: Retrieve a Group by ID
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Group ID
 *     responses:
 *       200:
 *         description: Group found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Group'
 *       404:
 *         description: Group not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Group not found
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */
const getGroupById = async (req, res) => {
  try {
    // Validate Id
    const { id } = req.params;
    const isValidId = mongoose.Types.ObjectId.isValid(id);
    if (!isValidId) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    const group = await Group.findById(id).populate({
      path: 'wardId',
      populate: {
        path: 'stakeId'
      }
    })
    .populate({
      path: 'instructorId',
      populate: {
        path: 'userId', 
        model: 'User'   
      }
    });

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    res.status(200).json({ message: 'Group found', group });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new Group
/**
 * @swagger
 * /api/groups:
 *   post:
 *     summary: Create a new Group
 *     tags: [Groups]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - _id
 *               - name
 *               - wardId
 *               - start_date
 *               - end_date
 *               - schedule
 *               - room
 *               - instructorId
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the Group
 *                 example: "Group A"
 *               wardId:
 *                 type: string
 *                 format: ObjectId
 *                 description: The ID of the Ward
 *                 example: "60d5f484f1a2c8b8f8e4b8c1"
 *               start_date:
 *                 type: string
 *                 format: date-time
 *                 description: The start date of the Group
 *                 example: "2023-10-01"
 *               end_date:
 *                 type: string
 *                 format: date-time
 *                 description: The end date of the Group
 *                 example: "2023-12-31"
 *               schedule:
 *                 type: string
 *                 description: The schedule of the Group
 *                 example: "Monday and Wednesday 10-12"
 *               room:
 *                 type: string
 *                 description: The room where the Group meets
 *                 example: "Room 101"
 *               instructorId:
 *                 type: string
 *                 format: ObjectId
 *                 description: The ID of the Instructor
 *                 example: "60d5f484f1a2c8b8f8e4b8c2"
 *     responses:
 *       201:
 *         description: Group created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Group'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */
const createGroup = async (req, res) => {
  try {
    // Validate the request body
    const { value, error } = groupSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Extract instructorId and wardId from the request body
    const { instructorId, wardId, name } = value;

    // Check the name uniqueness
    const existingGroup = await Group.findOne({ name: name });
    if (existingGroup) {
      return res.status(400).json({ error: 'Group name already exists' });
    }

    // Check if the instructor exists
    const instructor = await Instructor.findById(instructorId);
    if (!instructor) {
      return res.status(404).json({ error: 'Instructor not found' });
    }

    // Check if the ward exists
    const ward = await Ward.findById(wardId);
    if (!ward) {
      return res.status(404).json({ error: 'Ward not found' });
    }

    // Generate sessions
    const sessions = generateSessions();

    // Create the group
    const newGroup = await Group.create({
      ...value,
      sessions,
    });

    res.status(201).json({ message: 'Group created successfully', newGroup });
  } catch (error) {
    console.error('Error creating group:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get Groups by Ward ID
/**
 * @swagger
 * /api/groups/ward/{wardId}:
 *   get:
 *     summary: Get Groups by Ward ID
 *     description: Retrieve a list of Groups belonging to a specific Ward
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: wardId
 *         schema:
 *           type: string
 *         required: true
 *         description: Ward ID
 *     responses:
 *       200:
 *         description: A list of Groups in the specified Ward
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Group'
 *       400:
 *         description: Invalid Ward ID format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid Ward ID format
 *       404:
 *         description: Ward not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Ward not found
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */
const getGroupsByWard = async (req, res) => {
  try {
    // Validate the Ward ID
    const { wardId } = req.params;
    const isValidId = mongoose.Types.ObjectId.isValid(wardId);
    if (!isValidId) {
      return res.status(400).json({ error: 'Invalid Ward ID format' });
    }
    const groups = await Group.find({ wardId: wardId });

    if (groups.length === 0) {
      return res.status(404).json({ message: 'Ward not found' }); 
    }

    res.status(200).json({ message: 'Groups found', groups });
  } catch (error) {
    console.error('Error retrieving groups by ward:', error.message || error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

// Update a Group
/**
 * @swagger
 * /api/groups/{id}:
 *   put:
 *     summary: Update a Group by ID
 *     description: Update a Group's details.
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the Group to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the Group
 *                 example: "EC1-A"
 *               wardId:
 *                 type: string
 *                 format: ObjectId
 *                 description: The ward where the Group is located
 *                 example: "60d5f484f1a2c8b8f8e4b8c3"
 *               start_date:
 *                 type: string
 *                 format: date-time
 *                 description: The start date of the Group
 *                 example: "2023-10-01"
 *               end_date:
 *                 type: string
 *                 format: date-time
 *                 description: The end date of the Group
 *                 example: "2023-12-31"
 *               schedule:
 *                 type: string
 *                 description: The schedule of the Group
 *                 example: "Monday and Wednesday 10-12"
 *               room:
 *                 type: string
 *                 description: The room where the Group meets
 *                 example: "Room 101"
 *               instructorId:
 *                 type: string
 *                 format: ObjectId
 *                 description: The ID of the Instructor
 *                 example: "60d5f484f1a2c8b8f8e4b8c2"

 *     responses:
 *       200:
 *         description: The updated Group object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Group'
 *       400:
 *         description: Invalid request body or Group name already exists.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid request body or Group name already exists
 *       404:
 *         description: Group not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Group not found
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */
const updateGroup = async (req, res) => {
  try {
    // Validat the ID
    const { id } = req.params;
    const isValidId = mongoose.Types.ObjectId.isValid(id);
    if (!isValidId) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }
    
    // Validate the request body
    const { value, error } = groupUpdateSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    
    // Check if the instructor exists
    const instructor = await Instructor.findById(value.instructorId);
    if (!instructor) {
      return res.status(404).json({ error: 'Instructor not found' });
    }
    
    // Check if the ward exists
    const ward = await Ward.findById(value.wardId);
    if (!ward) {
      return res.status(404).json({ error: 'Ward not found' });
    }
    
    // Check the name uniqueness
    const existingGroup = await Group.findOne({ name: value.name });
    if (existingGroup) {
      return res.status(400).json({ error: 'Group name already exists' });
    }
    
    // Check if the group exists and update it
    const group = await Group.findByIdAndUpdate(id, value, { new: true }); // Populates stake and ward
    if (!group) {
      return res.status(404).send();
    }
    res.status(200).json({ message: 'Group updated successfully', group }); 
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a Group
/**
 * @swagger
 * /api/groups/{id}:
 *   delete:
 *     summary: Delete a Group by ID
 *     description: Delete a Group by ID
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Group ID
 *     responses:
 *       204:
 *         description: Group deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Group deleted successfully
 *       400:
 *         description: Invalid ID format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid ID format
 *       404:
 *         description: Group not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Group not found
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */
const deleteGroup = async (req, res) => {
  try {
    // Validate the ID
    const { id } = req.params;
    const isValidId = mongoose.Types.ObjectId.isValid(id);
    if (!isValidId) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    // Check if the group exists and delete it
    const group = await Group.findByIdAndDelete(id);
    if (!group) {
      return res.status(404).send();
    }
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * @swagger
 * /api/groups/sessions/{groupId}/{sessionNumber}:
 *   patch:
 *     summary: Update a session for a Group
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: groupId
 *         schema:
 *           type: string
 *         required: true
 *         description: Group ID
 *       - in: path
 *         name: sessionNumber
 *         schema:
 *           type: integer
 *         required: true
 *         description: Session number (1-25)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: The date of the session
 *                 example: "2025-05-10"
 *               topic:
 *                 type: string
 *                 description: The topic covered in the session
 *                 example: "Introduction to verb conjugation"
 *               completed:
 *                 type: boolean
 *                 description: Whether the session was completed
 *                 example: true
 *               notes:
 *                 type: string
 *                 description: Additional notes about the session
 *                 example: "Students struggled with verb conjugation"
 *     responses:
 *       200:
 *         description: Session updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Session updated successfully
 *                 session:
 *                   $ref: '#/components/schemas/Session'
 *       400:
 *         description: Invalid Group ID or Session Number
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid Group ID or Session Number
 *       404:
 *         description: Group or Session not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Group or Session not found
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to update session
 */
const updateSession = async (req, res) => {
  const { groupId, sessionNumber } = req.params;

  // Validate the groupId and sessionNumber
  const isValidGroupId = mongoose.Types.ObjectId.isValid(groupId);
  const isValidSessionNumber = !isNaN(sessionNumber) && parseInt(sessionNumber) > 0 && parseInt(sessionNumber) <= 25;
  if (!isValidGroupId || !isValidSessionNumber) {
    return res.status(400).json({ error: 'Invalid groupId or sessionNumber' });
  }
  // Validate the request body
  const { value, error } = updateSessionSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ error: 'Group not found' });

    const session = group.sessions.find(s => s.number === parseInt(sessionNumber));
    if (!session) return res.status(404).json({ error: 'Session not found' });

    Object.assign(session, value); // merge changes
    await group.save();

    res.status(200).json(session);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update session' });
  }
};

/**
 * @swagger
 * /api/groups/sessions/{groupId}:
 *   get:
 *     summary: Get all sessions for a Group
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: groupId
 *         schema:
 *           type: string
 *         required: true
 *         description: Group ID
 *     responses:
 *       200:
 *         description: A list of sessions for the specified Group
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Sessions found
 *                 sessions:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Session'
 *       400:
 *         description: Invalid Group ID format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid Group ID format
 *       404:
 *         description: Group not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Group not found
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to fetch sessions
 */
const getGroupSessions = async (req, res) => {
  try {
    // Validate the Group ID
    const { groupId } = req.params;
    const isValidId = mongoose.Types.ObjectId.isValid(groupId);
    if (!isValidId) {
      return res.status(400).json({ error: 'Invalid Group ID format' });
    }

    // Find the group by ID
    const group = await Group.findById(req.params.groupId);
    if (!group) return res.status(404).json({ error: 'Group not found' });

    res.status(200).json({ message: 'Sessions found', sessions: group.sessions });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
};


const generateSessions = () => {
  const sessions = [];
  const sessionCount = 25;

  for (let i = 0; i < sessionCount; i++) {
    sessions.push({
      number: i + 1,
      date: null,
      completed: false,
      topic: '',
      notes: ''
    });
  }

  return sessions;
};

module.exports = {
  createGroup,
  getGroups,
  getGroupById,
  updateGroup,
  deleteGroup,
  getGroupsByWard,
  updateSession,
  getGroupSessions,
};