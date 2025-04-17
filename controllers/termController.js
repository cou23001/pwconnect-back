// controllers/termController.js
const Term = require("../models/term");
const { termSchema, termUpdateSchema } = require("../validators/term");
const mongoose = require("mongoose");

/**
 * @swagger
 * tags:
 *   name: Terms
 *   description: Term management
 */

/**
 * @swagger
 * /api/terms:
 *   get:
 *     summary: Get a list of terms
 *     tags: [Terms]
 *     responses:
 *       200:
 *         description: A list of terms
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Term'
 *       404:
 *          description: Terms not found
 *          content:
 *            application/json:
 *              schema:
 *                type: string
 *                example: Terms not found
 *       400:
 *          description: Bad request
 *          content:
 *            application/json:
 *              schema:
 *                type: string
 *                example: Bad request
 *       500:
 *          description: Internal Server Error
 *          content:
 *            application/json:
 *              schema:
 *                type: string
 *                example: Internal Server Error
 */
const getTerms = async (req, res) => {
  try {
    // Fetch all terms from the database
    const terms = await Term.find();

    // Check if terms exist
    if (terms.length === 0) {
      return res.status(404).send("Terms not found");
    }
    // Return the terms
    res.json({ message: "Terms found", terms });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

/**
 * @swagger
 * /api/terms:
 *   post:
 *     summary: Create a new term
 *     tags: [Terms]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Fall 2023
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: 2023-09-01
 *               endDate:
 *                 type: string
 *                 format: date
 *                 example: 2024-01-15
 *             required:
 *               - name
 *               - startDate
 *               - endDate
 *     responses:
 *       201:
 *         description: The term was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Term'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Bad request
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Internal Server Error
 */
const createTerm = async (req, res) => {
  try {
    // Validate request
    const { error, value } = termSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Create start and end date objects
    const start = new Date(value.startDate);
    const end = new Date(value.endDate);

    // Check if start date is before end date
    if (start >= end) {
      return res
        .status(400)
        .json({ message: "Start date must be before end date" });
    }

    // Check for duplicates in the database
    const existingTerm = await Term.findOne({
      $or: [{ name: value.name }, { startDate: start }, { endDate: end }],
    });

    if (existingTerm) {
      if (existingTerm.name === value.name) {
        return res.status(400).json({ message: "Term name already exists" });
      }
      if (existingTerm.startDate.toISOString() === start.toISOString()) {
        return res.status(400).json({ message: "Start date already exists" });
      }
      if (existingTerm.endDate.toISOString() === end.toISOString()) {
        return res.status(400).json({ message: "End date already exists" });
      }
    }

    // Create a new term
    const term = await Term.create(value);

    // Return the created term
    res.status(201).json({ message: "Term created successfully", term });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * @swagger
 * /api/terms/{id}:
 *   get:
 *     summary: Get a term by ID
 *     tags: [Terms]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The term ID
 *     responses:
 *       200:
 *         description: The term
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Term'
 *       404:
 *         description: Term not found
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Term not found
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Bad request
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Internal Server Error
 */
const getTermById = async (req, res) => {
  try {
    const { id } = req.params;
    // Validate ID format
    const isValidId = mongoose.Types.ObjectId.isValid(id);
    if (!isValidId) {
      return res.status(400).send("Invalid ID format");
    }

    // Fetch the term by ID
    const term = await Term.findById(id);

    // Check if the term exists
    if (!term) {
      return res.status(404).send("Term not found");
    }

    // Return the term
    res.json({ message: "Term found", term });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

/**
 * @swagger
 * /api/terms/{id}:
 *   put:
 *     summary: Update a term
 *     tags: [Terms]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The term ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Term'
 *     responses:
 *       200:
 *         description: The term was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Term'
 *       400:
 *         description: Bad request
 */
const updateTerm = async (req, res) => {
  try {
    const { id } = req.params;
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    // Validate request
    const { error, value } = termUpdateSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Create start and end date objects
    const start = new Date(value.startDate);
    const end = new Date(value.endDate);

    // Check if start date is before end date
    if (start >= end) {
      return res
        .status(400)
        .json({ message: "Start date must be before end date" });
    }

    // Check for duplicates in other terms (exclude current one)
    const existingTerm = await Term.findOne({
      _id: { $ne: id },
      $or: [{ name: value.name }, { startDate: start }, { endDate: end }],
    });

    if (existingTerm) {
      if (existingTerm.name === value.name) {
        return res.status(400).json({ message: "Term name already exists" });
      }
      if (existingTerm.startDate.toISOString() === start.toISOString()) {
        return res.status(400).json({ message: "Start date already exists" });
      }
      if (existingTerm.endDate.toISOString() === end.toISOString()) {
        return res.status(400).json({ message: "End date already exists" });
      }
    }

    // Update the term
    const updatedTerm = await Term.findByIdAndUpdate(id, value, {
      new: true,
      runValidators: true,
    });

    // Check if the term was found and updated
    if (!updatedTerm) {
      return res.status(404).json({ message: "Term not found" });
    }

    // Return the updated term
    res
      .status(200)
      .json({ message: "Term updated successfully", term: updatedTerm });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * @swagger
 * /api/terms/{id}:
 *   delete:
 *     summary: Delete a term
 *     tags: [Terms]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The term ID
 *     responses:
 *       200:
 *         description: The term was deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Term deleted successfully
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Invalid ID format
 *       404:
 *         description: Term not found
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Term not found
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Internal Server Error
 */
const deleteTerm = async (req, res) => {
  try {
    const { id } = req.params;
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({ error: "Invalid ID format" });
    }
    
    // Check if the term exists and delete it
    const term = await Term.findByIdAndDelete(id);
    if (!term) {
      return res.status(404).send({ error: "Term not found" });
    }

    // Return success message
    res.json({ message: "Term deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

module.exports = {
  getTerms,
  createTerm,
  getTermById,
  updateTerm,
  deleteTerm,
};
