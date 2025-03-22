// controllers/groupController.js
const Group = require('../models/group');

/**
 * @swagger
 * tags:
 *   name: Groups
 *   description: Group management
 */

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
 *               - group_id
 *               - name
 *               - stake
 *               - ward
 *               - start_date
 *             properties:
 *               group_id:
 *                 type: string
 *                 description: The unique identifier of the Group
 *               name:
 *                 type: string
 *                 description: The name of the Group
 *               stake:
 *                 type: string
 *                 format: ObjectId
 *                 description: The stake where the Group is located
 *               ward:
 *                 type: string
 *                 format: ObjectId
 *                 description: The ward where the Group is located
 *               start_date:
 *                 type: string
 *                 format: date-time
 *                 description: The start date of the Group
 *               end_date:
 *                 type: string
 *                 format: date-time
 *                 description: The end date of the Group
 *               schedule:
 *                 type: string
 *                 description: The schedule of the Group
 *               other_group_data:
 *                 type: object
 *                 description: Other relevant data of the Group
 *     responses:
 *       201:
 *         description: Group created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Group'
 *       500:
 *         description: Internal Server Error
 */

const createGroup = async (req, res) => {
  try {
    const group = new Group(req.body);
    await group.save();
    res.status(201).json({ group });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

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
 */

const getGroups = async (req, res) => {
  try {
    const groups = await Group.find().populate('stake').populate('ward'); // Populates stake and ward
    res.status(200).json({ groups });
  } catch (error) {
    res.status(400).json({ error: error.message });
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
 *       500:
 *         description: Internal Server Error
 */

const getGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id).populate('stake').populate('ward'); // Populates stake and ward
    if (!group) {
      return res.status(404).send();
    }
    res.status(200).json({ group });
  } catch (error) {
    res.status(400).json({ error: error.message });
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
 *               group_id:
 *                 type: string
 *                 description: The unique identifier of the Group
 *               name:
 *                 type: string
 *                 description: The name of the Group
 *               stake:
 *                 type: string
 *                 format: ObjectId
 *                 description: The stake where the Group is located
 *               ward:
 *                 type: string
 *                 format: ObjectId
 *                 description: The ward where the Group is located
 *               start_date:
 *                 type: string
 *                 format: date-time
 *                 description: The start date of the Group
 *               end_date:
 *                 type: string
 *                 format: date-time
 *                 description: The end date of the Group
 *               schedule:
 *                 type: string
 *                 description: The schedule of the Group
 *               other_group_data:
 *                 type: object
 *                 description: Other relevant data of the Group
 *     responses:
 *       200:
 *         description: The updated Group object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Group'
 *       404:
 *         description: Group not found.
 *       500:
 *         description: Internal Server Error.
 */

const updateGroup = async (req, res) => {
  try {
    const group = await Group.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('stake').populate('ward'); // Populates stake and ward
    if (!group) {
      return res.status(404).send();
    }
    res.status(200).json({ group });
  } catch (error) {
    res.status(400).json({ error: error.message });
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
 *       404:
 *         description: Group not found
 *       500:
 *         description: Internal Server Error
 */

const deleteGroup = async (req, res) => {
  try {
    const group = await Group.findByIdAndDelete(req.params.id);
    if (!group) {
      return res.status(404).send();
    }
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createGroup,
  getGroups,
  getGroup,
  updateGroup,
  deleteGroup,
};