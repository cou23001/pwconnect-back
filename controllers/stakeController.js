// controllers/stakeController.js
const Stake = require('../models/stake');
const Ward = require('../models/ward');
const { validateStake } = require('../validators/stake');
const { message } = require('../validators/user');


/**
 * @swagger
 * tags:
 *   name: Stakes
 *   description: Stake management
 */

// Get all stakes
/**
 * @swagger
 * /api/stakes:
 *   get:
 *     summary: Get a list of stakes
 *     tags: [Stakes]
 *     responses:
 *       200:
 *         description: A list of stakes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Stakes retrieved successfully"
 *                 data:
 *                   type: array
 *                   description: List of stakes 
 *                   items:
 *                     $ref: '#/components/schemas/Stake'
 *       404:
 *         description: No stakes found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: No stakes found
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal Server Error
 */
const getStakes = async (req, res) => {
  try {
    const stakes = await Stake.find();

    if (stakes.length === 0) {
      return res.status(200).json({ message: 'No stakes found', stakes: [] });
    }

    res.status(200).json({ message: 'Stakes retrieved successfully', data: stakes });
  } catch (error) {
    console.error('Error fetching stakes:', error.message || error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create a new stake
/**
 * @swagger
 * /api/stakes:
 *   post:
 *     summary: Create a new stake
 *     tags: [Stakes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - stakeId
 *               - name
 *               - location
 *             properties:
 *               stakeId:
 *                 type: string
 *                 description: The stake's stakeId
 *               name:
 *                 type: string
 *                 description: The stake's name
 *               location:
 *                 type: string
 *                 description: The stake's location
 *     responses:
 *       201:
 *         description: Stake created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Stake'
 *       500:
 *         description: Internal Server Error
 */
const createStake = async (req, res) => {
  try {
    // Validate input with stake validator
    const { error } = validateStake(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { name, location } = req.body;

    // Optional: Prevent duplicate stakes if name should be unique
    const existingStake = await Stake.findOne({ name });
    if (existingStake) {
      return res.status(409).json({ error: 'Stake with this name already exists' });
    }

    // Create new stake
    const stake = new Stake({ name, location });
    await stake.save();

    res.status(201).json({ message: 'Stake created successfully', stake });
  } catch (error) {
    console.error('Error creating stake:', error.message || error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};




// Get a stake by ID
/**
 * @swagger
 * /api/stakes/{id}:
 *    get:
 *      summary: Get a stake by ID
 *      description: Retrieve a stake by ID
 *      tags: [Stakes]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: Stake ID
 *      responses:
 *        200:
 *          description: Stake found
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Stake'
 *        404:
 *          description: Stake not found
 *        500:
 *          description: Internal Server Error
 */
const getStake = async (req, res) => {
  try {
    const stake = await Stake.findById(req.params.id);
    res.status(200).json({ stake });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a stake
/**
 * @swagger
 * /api/stakes/{id}:
 *   put:
 *     summary: Update a stake by ID
 *     description: Update a stake's details.
 *     tags: [Stakes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the stake to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The stake's name.
 *               location:
 *                 type: string
 *                 description: The stake's name.
 *     responses:
 *       200:
 *         description: The updated war object (password excluded).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Stake'
 *       404:
 *         description: Stake not found.
 *       500:
 *         description: Internal Server Error.
 */
const updateStake = async (req, res) => {
  try {
    const { name, location } = req.body;
    const stake = await Stake.findById(req.params.id);
    if (!stake) {
      return res.status(404).send('Stake not found');
    }
    // Validate if changes are made
    if (name === stake.name && location === stake.location) {
      return res.status(400).send('No changes made');
    }

    // Update stake
    if (name) { stake.name = name; }
    if (location) { stake.location = location; }
    await stake.save();
    res.status(200).json({ stake });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a stake
/**
 * @swagger
 * /api/stakes/{id}:
 *    delete:
 *      summary: Delete a stake by ID
 *      description: Delete a stake by ID
 *      tags: [Stakes]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: Stake ID
 *      responses:
 *        200:
 *          description: Stake deleted
 *          content:
 *            application/json:
 *              schema:
 *               $ref: '#/components/schemas/Stake'
 *        404:
 *          description: Stake not found
 *        500:
 *          description: Internal Server Error
 */
const deleteStake = async (req, res) => {
  try {
    await Stake.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all wards in a stake
// Get all wards
/**
 * @swagger
 * /api/stakes/wards:
 *   get:
 *     summary: Get a list of wards in a stake
 *     tags: [Stakes]
 *     responses:
 *       200:
 *         description: A list of wards in a stake
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ward'
 */
const getWardsInStake = async (req, res) => {
  try {
    const wards = await Ward.find({ stakeId: req.params.id });
    res.status(200).json({ wards });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createStake,
  getStakes,
  getStake,
  updateStake,
  deleteStake,
  getWardsInStake,
};