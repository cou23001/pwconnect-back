// controllers/stakeController.js
const Stake = require('../models/stake');
const Ward = require('../models/ward');


/**
 * @swagger
 * tags:
 *   name: Stakes
 *   description: Stake management
 */

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
 *               - name
 *               - location
 *               - stakeId
 *             properties:
 *               name:
 *                 type: string
 *                 description: The stake's name
 *               location:
 *                 type: string
 *                 description: The stake's location
 *               stakeId:
 *                 type: string
 *                 description: The stake's stakeId
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
    const { name, location } = req.body;
    const stake = new Stake({ name, location });
    await stake.save();
    res.status(201).json({ stake });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

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
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Stake'
 */
const getStakes = async (req, res) => {
  try {
    const stakes = await Stake.find();
    res.status(200).json({ stakes });
  } catch (error) {
    res.status(400).json({ error: error.message });
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
    stake.name = name;
    stake.location = location;
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