// controllers/instructorController.js
const Instructor = require("../models/instructor");
const User = require("../models/user");
const mongoose = require("mongoose");
const argon2 = require("argon2");
const UserRole = require("../models/userRole");

/**
 * @swagger
 * tags:
 *   name: Instructors
 *   description: Instructor management
 */

/**
 * @swagger
 * /api/instructors:
 *   get:
 *     summary: Get a list of instructors
 *     tags: [Instructors]
 *     responses:
 *       200:
 *         description: A list of instructors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Instructor'
 */
const getInstructors = async (req, res) => {
  try {
    const instructors = await Instructor.find();
    if (instructors.length === 0) {
      return res.status(404).send("Instructors not found");
    }
    res.json(instructors);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

/**
 * @swagger
 * /api/instructors:
 *   post:
 *     summary: Create a new instructor
 *     tags: [Instructors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Instructor'
 *     responses:
 *       201:
 *         description: The instructor was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Instructor'
 *       400:
 *         description: Bad request (e.g., invalid input, duplicate email)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid input"
 *       500:
 *         description: Internal server error
 *     security:
 *       - BearerAuth: [] # Add if authentication is required
 */
const createInstructor = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { firstName, lastName, email, password, role="instructor" } = req.body;
    // Validate input
    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if the email is already registered
    const existingUser = await User.findOne({ email }).session(session);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Get the user role
    const userRole = await UserRole.findOne({ name: role });
    if (!userRole) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    // Hash the password
    const hashedPassword = await argon2.hash(password);

    // Create the user
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: userRole._id,
    });
    await user.save({ session });

    // Create the instructor
    const instructor = new Instructor({ userId: user._id });
    await instructor.save({ session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    // Respond with the instructor
    res.status(201).json(instructor);
  } catch (error) {
    // Abort the transaction on error
    await session.abortTransaction();
    session.endSession();

    console.error(error);
    if (error.name === 'ValidationError') {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

/**
 * @swagger
 * /api/instructors/{id}:
 *   get:
 *     summary: Get an instructor by ID
 *     tags: [Instructors]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The instructor ID
 *     responses:
 *       200:
 *         description: An instructor object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Instructor'
 *       404:
 *         description: The instructor was not found
 */
const getInstructorById = async (req, res) => {
  try {
    const instructor = await Instructor.findById(req.params.id);
    if (!instructor) {
      res.status(404).send("The instructor was not found");
    }
    res.json(instructor);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

/**
 * @swagger
 * /api/instructors/{id}:
 *   put:
 *     summary: Update an instructor
 *     tags: [Instructors]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The instructor ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Instructor'
 *     responses:
 *       200:
 *         description: The instructor was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Instructor'
 *       404:
 *         description: The instructor was not found
 */
const updateInstructor = async (req, res) => {
  try {
    const instructor = await Instructor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!instructor) {
      res.status(404).send("The instructor was not found");
    }
    res.json(instructor);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

/**
 * @swagger
 * /api/instructors/{id}:
 *   delete:
 *     summary: Delete an instructor
 *     tags: [Instructors]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The instructor ID
 *     responses:
 *       200:
 *         description: The instructor was deleted
 *       404:
 *         description: The instructor was not found
 */
const deleteInstructor = async (req, res) => {
  try {
    const instructor = await Instructor.findByIdAndDelete(req.params.id);
    if (!instructor) {
      res.status(404).send("The instructor was not found");
    }
    res.json(instructor);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  getInstructors,
  createInstructor,
  getInstructorById,
  updateInstructor,
  deleteInstructor,
};
