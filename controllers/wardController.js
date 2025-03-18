// controllers/wardControllers.js
const Ward = require('../models/ward');
/**
 * @swagger
 * tags:
 *   name: Wards
 *   description: Ward management
 */
// Create a new ward
/**
 * @swagger
 * /api/wards:
 *   post:
 *     summary: Create a new ward
 *     tags: [Wards]
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
 *                 description: The ward's name
 *               location:
 *                 type: string
 *                 description: The ward's location
 *               stakeId:
 *                 type: string
 *                 format: objectid
 *                 description: The ward's stakeId
 *                 ref: 'Stake' 
 *     responses:
 *       201:
 *         description: Ward created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ward'
 *       500:
 *         description: Internal Server Error
 */
const createWard = async (req, res) => {
  try {
    const { name, location, stakeId } = req.body;
    const ward = new Ward({ name, location, stakeId });
    await ward.save();
    res.status(201).json({ ward });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all wards
/**
 * @swagger
 * /api/wards:
 *   get:
 *     summary: Get a list of wards
 *     tags: [Wards]
 *     responses:
 *       200:
 *         description: A list of wards
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ward'
 */
const getWards = async (req, res) => {
  try {
    const wards = await Ward.find();
    res.status(200).json({ wards });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get a ward by ID
/**
 * @swagger
 * /api/wards/{id}:
 *    get:
 *      summary: Get a ward by ID
 *      description: Retrieve a ward by ID
 *      tags: [Wards]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: Ward ID
 *      responses:
 *        200:
 *          description: Ward found
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Ward'
 *        404:
 *          description: Ward not found
 *        500:
 *          description: Internal Server Error
 */
const getWard = async (req, res) => {
  try {
    const ward = await Ward.findById(req.params.id);
    res.status(200).json({ ward });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a ward
/**
 * @swagger
 * /api/wards/{id}:
 *   put:
 *     summary: Update a ward by ID
 *     description: Update a ward's details.
 *     tags: [Wards]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the ward to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The ward's first name.
 *               location:
 *                 type: string
 *                 description: The ward's last name.
 *               stakeId:
 *                 type: object
 *                 description: The ward's email address.
 *     responses:
 *       200:
 *         description: The updated war object (password excluded).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ward'
 *       404:
 *         description: Ward not found.
 *       500:
 *         description: Internal Server Error.
 */
const updateWard = async (req, res) => {
  try {
    const { name, location } = req.body;
    const ward = await Ward.findById(req.params.id);
    ward.name = name;
    ward.location = location;
    await ward.save();
    res.status(200).json({ ward });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a ward
/**
 * @swagger
 * /api/wards/{id}:
 *    delete:
 *      summary: Delete a ward by ID
 *      description: Delete a ward by ID
 *      tags: [Wards]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: Ward ID
 *      responses:
 *        200:
 *          description: Ward deleted
 *          content:
 *            application/json:
 *              schema:
 *               $ref: '#/components/schemas/Ward'
 *        404:
 *          description: Ward not found
 *        500:
 *          description: Internal Server Error
 */
const deleteWard = async (req, res) => {
  try {
    await Ward.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createWard,
  getWards,
  getWard,
  updateWard,
  deleteWard,
};