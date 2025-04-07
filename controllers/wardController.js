// controllers/wardControllers.js
const Ward = require('../models/ward');
const { wardSchema, wardUpdateSchema } = require('../validators/ward');
const mongoose = require('mongoose');
/**
 * @swagger
 * tags:
 *   name: Wards
 *   description: Ward management
 */

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
    const wards = await Ward.find().populate('stakeId');
    // Check if wards exist
    if (wards.length === 0) {
      return res.status(404).send('No wards found');
    }
    // Return the wards
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
 *        400:
 *          description: Invalid ID format
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  error:
 *                    type: string
 *                    description: Error message
 *                    example: Invalid ID format
 *        404:
 *          description: Ward not found
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  error:
 *                    type: string
 *                    description: Error message
 *                    example: Ward not found
 *        500:
 *          description: Internal Server Error
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  error:
 *                    type: string
 *                    description: Error message
 *                    example: Internal Server Error
 */
const getWardById = async (req, res) => {
  try {
    const { id } = req.params;
    // Check if the ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({ error: 'Invalid ID format' });
    }
    // Find the ward by ID
    const ward = await Ward.findById(id).populate('stakeId');
    // Check if the ward exists
    if (!ward) {
      return res.status(404).send({ error: 'Ward not found' });
    }
    // Return the ward
    res.status(200).json({ message: 'Ward found', ward });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

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
 *                 example: "Ward 1"
 *               location:
 *                 type: string
 *                 description: The ward's location
 *                 example: "123 Main St, City, Country"
 *               stakeId:
 *                 type: string
 *                 format: objectid
 *                 description: The ward's stakeId
 *                 example: "507f1f77bcf86cd799439011"
 *     responses:
 *       201:
 *         description: Ward created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ward'
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *                   example: Internal Server Error
 */
const createWard = async (req, res) => {
  try {
    const { error } = wardSchema.validate(req.body);
    if (error) {
      return res.status(400).send({ error: error.details[0].message });
    }
    const { name, location, stakeId } = req.body;

    const ward = new Ward({ name, location, stakeId });
    await ward.save();

    // Populate stake details
    const populatedWard = await Ward.findById(ward._id).populate('stakeId').lean();

    res.status(201).json({ message: 'Ward created successfully', populatedWard });
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
 *           format: objectid
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         required: true
 *         description: The ID of the ward to update (must be a valid ObjectId).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The ward's name.
 *                 example: "Updated Ward Name"
 *               location:
 *                 type: string
 *                 description: The ward's location.
 *                 example: "456 Updated St, City, Country"
 *               stake:
 *                 type: string
 *                 format: objectid
 *                 pattern: '^[0-9a-fA-F]{24}$'
 *                 description: The updated stakeId of the ward (must be a valid ObjectId).
 *                 example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Ward updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message.
 *                   example: "Ward updated successfully"
 *                 ward:
 *                   $ref: '#/components/schemas/Ward'
 *       400:
 *         description: Bad Request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 *                   example: "Invalid ID format"
 *       404:
 *         description: Ward not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 *                   example: "Ward not found"
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 *                   example: "Internal Server Error"
 */
const updateWard = async (req, res) => {
  try {
    const { name, location, stakeId } = req.body;
    // Validate the request body
    const { error } = wardUpdateSchema.validate(req.body);
    if (error) {
      return res.status(400).send({ error: error.details[0].message });
    }
    const ward = await Ward.findById(req.params.id).populate('stakeId');
    if (!ward) {
      return res.status(404).send({ error: 'Ward not found' });
    }

    // Validate if changes were made
    if (!name && !location && !stakeId) {
      return res.status(400).send({ error: 'No changes made' });
    }

    // Modify if there are changes
    if (name) { ward.name = name;}
    if (location) { ward.location = location; }
    if (stakeId) { ward.stakeId = stakeId;}
    
    await ward.save();
    res.status(200).json({ message: 'Ward updated successfully', ward });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
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
 *        204:
 *          description: Ward deleted successfully
 *        400:
 *          description: Invalid ID format
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  error:
 *                    type: string
 *                    description: Error message
 *                    example: Invalid ID format
 *        404:
 *          description: Ward not found
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  error:
 *                    type: string
 *                    description: Error message
 *                    example: Ward not found
 *        500:
 *          description: Internal Server Error
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  error:
 *                    type: string
 *                    description: Error message
 *                    example: Internal Server Error
 */
const deleteWard = async (req, res) => {
  try {
    // Check if the ID is a valid ObjectId
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({ error: 'Invalid ID format' });
    }
    // Check if the ward exists
    const ward = await Ward.findById(id);
    if (!ward) {
      return res.status(404).send({ error: 'Ward not found' });
    }
    // Delete the ward
    await ward.deleteOne();
    // Return success message
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createWard,
  getWards,
  getWardById,
  updateWard,
  deleteWard,
};