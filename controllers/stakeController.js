// controllers/stakeController.js
const Stake = require("../models/stake");
const Ward = require("../models/ward");
const {
  validateStake,
  validateStakeId,
  validateStakeUpdate,
} = require("../validators/stake");

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
    // Fetch all stakes
    const stakes = await Stake.find();

    // Check if stakes exist
    if (stakes.length === 0) {
      return res.status(200).json({ message: "No stakes found" });
    }

    // Return the stakes
    res
      .status(200)
      .json({ message: "Stakes retrieved successfully", data: stakes });
  } catch (error) {
    console.error("Error fetching stakes:", error.message || error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * @swagger
 * /api/stakes/country/{countryName}:
 *   get:
 *     summary: Get a list of stakes by country
 *     tags: [Stakes]
 *     parameters:
 *       - in: path
 *         name: countryName
 *         required: true
 *         description: The name of the country to filter by
 *         schema:
 *           type: string
 *           example: Bolivia
 *     responses:
 *       200:
 *         description: A list of stakes in the specified country
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Stakes in Bolivia retrieved successfully"
 *                 data:
 *                   type: array
 *                   description: List of stakes in the specified country
 *                   items:
 *                     $ref: '#/components/schemas/Stake'
 *       404:
 *         description: No stakes found in the specified country
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: No stakes found in Bolivia
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

const getStakesByCountry = async (req, res) => {
  const { countryName } = req.params;

  try {
    // Use a case-insensitive regex to find stakes where the location contains the country name
    const stakes = await Stake.find({
      location: { $regex: new RegExp(countryName, "i") },
    });

    if (stakes.length === 0) {
      return res
        .status(200)
        .json({ message: `No stakes found in ${countryName}`, data: [] });
    }

    res
      .status(200)
      .json({
        message: `Stakes in ${countryName} retrieved successfully`,
        data: stakes,
      });
  } catch (error) {
    console.error(
      `Error fetching stakes by country (${countryName}):`,
      error.message || error
    );
    res.status(500).json({ error: "Internal server error" });
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
 *               - name
 *               - location
 *             properties:
 *               name:
 *                 type: string
 *                 description: The stake's name
 *                 example: "Stake Name"
 *               location:
 *                 type: string
 *                 description: The stake's location
 *                 example: "Location Name"
 *     responses:
 *       201:
 *         description: Stake created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Stake'
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid input data"
 *       409:
 *         description: Conflict
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Stake with this name already exists"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
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
      return res
        .status(409)
        .json({ error: "Stake with this name already exists" });
    }

    // Create new stake
    const stake = new Stake({ name, location });
    await stake.save();

    res.status(201).json({ message: "Stake created successfully", stake });
  } catch (error) {
    console.error("Error creating stake:", error.message || error);
    res.status(500).json({ error: "Internal Server Error" });
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
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: "Stake found"
 *                  stake:
 *                    type: object
 *                    $ref: '#/components/schemas/Stake'
 *        400:
 *          description: Invalid ID format
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  error:
 *                    type: string
 *                    example: "Invalid ID format"
 *        404:
 *          description: Stake not found
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  error:
 *                    type: string
 *                    example: "Stake not found"
 *        500:
 *          description: Internal Server Error
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  error:
 *                    type: string
 *                    example: "Internal Server Error"
 */
const getStakeById = async (req, res) => {
  try {
    // Validate stake ID
    const { error } = validateStakeId(req.params.id);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Find stake by ID
    const stake = await Stake.findById(req.params.id);
    if (!stake) {
      return res.status(404).json({ error: "Stake not found" });
    }
    res.status(200).json({ message: "Stake found", stake });
  } catch (error) {
    console.error("Error fetching stake:", error.message || error);
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
 *         description: Stake updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Stake updated successfully"
 *                 stake:
 *                   type: object
 *                   $ref: '#/components/schemas/Stake'
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid input data"
 *       404:
 *         description: Stake not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Stake not found"
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */
const updateStake = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location } = req.body;

    // Validate input with stake validator
    const { error } = validateStakeUpdate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Find existing stake
    const stake = await Stake.findById(id);
    if (!stake) {
      return res.status(404).send({ error: "Stake not found" });
    }

    // Validate if changes are actually made
    if (
      (!name || name === stake.name) &&
      (!location || location === stake.location)
    ) {
      return res.status(400).json({ error: "No changes detected in update" });
    }

    // Modify if there are changes
    if (name) {
      stake.name = name;
    }
    if (location) {
      stake.location = location;
    }

    await stake.save();

    res
      .status(200)
      .json({ message: "Stake updated successfully", stake: stake });
  } catch (error) {
    console.error("Error updating stake:", error.message || error);
    res.status(500).json({ error: "Internal Server Error" });
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
 *        204:
 *          description: Stake deleted successfully
 *        400:
 *          description: Bad Request
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  error:
 *                    type: string
 *                    example: "Invalid ID format"
 *        404:
 *          description: Stake not found
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  error:
 *                    type: string
 *                    example: "Stake not found"
 *        500:
 *          description: Internal Server Error
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  error:
 *                    type: string
 *                    example: "Internal Server Error"
 */
const deleteStake = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate stake ID
    const { error } = validateStakeId(id);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Check if stake exists
    const stake = await Stake.findById(id);
    if (!stake) {
      return res.status(404).json({ error: "Stake not found" });
    }

    // Check if stake has wards
    const wards = await Ward.find({ stakeId: id });

    if (wards.length > 0) {
      return res
        .status(400)
        .json({ error: "Stake has wards and cannot be deleted" });
    }

    // Delete stake
    await stake.deleteOne({ _id: id }); // Use the correct way to delete by ID
    res.status(200).json({ message: "Stake deleted successfully" });
  } catch (error) {
    console.error("Error deleting stake:", error.message || error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all wards in a stake
/**
 * @swagger
 * /api/stakes/wards/{id}:
 *   get:
 *     summary: Get a list of wards in a stake
 *     tags: [Stakes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: A list of wards in a stake
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ward'
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid ID format"
 *       404:
 *         description: Stake not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Stake not found"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */
const getWardsInStake = async (req, res) => {
  try {
    // Validate stake ID
    const stakeId = req.params.id;
    const { error } = validateStakeId(stakeId);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    // Check if stake exists
    const stake = await Stake.findById(stakeId);
    if (!stake) {
      return res.status(404).json({ error: "Stake not found" });
    }
    // Find wards in the stake
    const wards = await Ward.find({ stakeId }).populate("stakeId");
    res
      .status(200)
      .json({ message: "Wards retrieved successfully", wards: wards });
  } catch (error) {
    console.error("Error fetching wards:", error.message || error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createStake,
  getStakes,
  getStakeById,
  updateStake,
  deleteStake,
  getWardsInStake,
  getStakesByCountry,
};
