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
 *     summary: Get a list of instructors with user details
 *     tags: [Instructors]
 *     responses:
 *       200:
 *         description: A list of instructors with user details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Instructors found"
 *                 data:
 *                   type: array
 *                   description: List of instructors
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: Unique ID of the instructor
 *                       userId:
 *                         type: string
 *                         description: Unique ID of the associated user
 *                       firstName:
 *                         type: string
 *                         description: First name of the instructor
 *                       lastName:
 *                         type: string
 *                         description: Last name of the instructor
 *                       email:
 *                         type: string
 *                         format: email
 *                         description: Email of the instructor
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: Timestamp when the instructor was created
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         description: Timestamp when the instructor was last updated
 *       404:
 *         description: No instructors found
 *       500:
 *         description: Internal server error
 */
const getInstructors = async (req, res) => {
  try {
    const instructors = await Instructor.find().populate("userId");
    if (instructors.length === 0) {
      return res.status(404).send("Instructors not found");
    }

    // Construct the response
    const response = instructors.map((instructor) => ({
      _id: instructor._id,
      userId: instructor.userId._id,
      firstName: instructor.userId.firstName,
      lastName: instructor.userId.lastName,
      email: instructor.userId.email,
      createdAt: instructor.createdAt,
      updatedAt: instructor.updatedAt,
    }));

    res.json({ message: "Instructors found", data: response });
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
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: The instructor's first name.
 *               lastName:
 *                 type: string
 *                 description: The instructor's last name.
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The instructor's email address.
 *               password:
 *                 type: string
 *                 format: password
 *                 description: The instructor's password.
 *               role:
 *                 type: string
 *                 description: The instructor's role (default is "instructor").
 *                 default: "instructor"
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *             example:
 *               firstName: "John"
 *               lastName: "Doe"
 *               email: "john.doe@example.com"
 *               password: "password123"
 *               role: "instructor"
 *     responses:
 *       201:
 *         description: The instructor was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Instructor'
 *       400:
 *         description: Bad request (e.g., invalid input, duplicate email, invalid role).
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
 *       - BearerAuth: []
 */
const createInstructor = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      role = "instructor",
    } = req.body;
    // Validate input
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if the email is already registered
    const existingUser = await User.findOne({ email }).session(session);
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Get the user role
    const userRole = await UserRole.findOne({ name: role });
    if (!userRole) {
      return res.status(400).json({ error: "Invalid role" });
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
    if (error.name === "ValidationError") {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
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
 *           format: objectid
 *         required: true
 *         description: The ID of the instructor to fetch.
 *     responses:
 *       200:
 *         description: The instructor details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Instructor found"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       format: objectid
 *                       description: The ID of the instructor.
 *                     userId:
 *                       type: string
 *                       format: objectid
 *                       description: The ID of the associated user.
 *                     firstName:
 *                       type: string
 *                       description: The user's first name.
 *                     lastName:
 *                       type: string
 *                       description: The user's last name.
 *                     email:
 *                       type: string
 *                       format: email
 *                       description: The user's email address.
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: The date and time when the instructor was created.
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: The date and time when the instructor was last updated.
 *       404:
 *         description: The instructor was not found.
 *       500:
 *         description: Internal server
 */
const getInstructorById = async (req, res) => {
  try {
    // Find the instructor and populate the user
    const instructor = await Instructor.findById(req.params.id).populate(
      "userId"
    );
    if (!instructor) {
      return res.status(404).send({ error: "Instructor not found" });
    }
    // Extract the user details
    const user = instructor.userId;

    // Construct the response
    const response = {
      _id: instructor._id,
      userId: instructor._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      createdAt: instructor.createdAt,
      updatedAt: instructor.updatedAt,
    };

    // Send the response
    res.status(200).json({ message: "Instructor found", data: response });
  } catch (error) {
    console.error("Error fetching instructor:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
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
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: Updated first name of the instructor
 *               lastName:
 *                 type: string
 *                 description: Updated last name of the instructor
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Updated email of the instructor
 *     responses:
 *       200:
 *         description: The instructor was succesfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Instructor updated successfully"
 *                 data:
 *                   properties:
 *                     _id:
 *                       type: string
 *                       format: objectid
 *                       description: The ID of the instructor.
 *                     userId:
 *                       type: string
 *                       format: objectid
 *                       description: The ID of the associated user.
 *                     firstName:
 *                       type: string
 *                       description: The user's first name.
 *                     lastName:
 *                       type: string
 *                       description: The user's last name.
 *                     email:
 *                       type: string
 *                       format: email
 *                       description: The user's email address.
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: The date and time when the instructor was created.
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: The date and time when the instructor was last updated.
 *       400:
 *         description: Bad request, no fields provided for update
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "At least one field must be provided"
 *       404:
 *         description: Instructor or user not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "The instructor was not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
const updateInstructor = async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;

    // Ensure at least one field is provided for update
    if (!firstName && !lastName && !email) {
        return res
          .status(400)
          .json({ message: "At least one field must be provided" });
    }

    // Find the instructor
    const instructor = await Instructor.findById(req.params.id);
    if (!instructor) {
      return res.status(404).json({ message: "The instructor was not found" });
    }

    // Update the associated user if necessary
    let user = await User.findById(instructor.userId);
    if (!user) {
      return res.status(404).json({ message: "The user was not found" });
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;

    await user.save({ validateModifiedOnly: true }); // Save updated user details

    // Respond with the updated instructor
    const response = {
        _id: instructor._id,
        userId: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        createdAt: instructor.createdAt,
        updatedAt: new Date(),
    };

    res.json({ message: "Instructor updated successfully", data: response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error: error.message });
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
