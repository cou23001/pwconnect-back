// controllers/instructorController.js
const Instructor = require("../models/instructor");
const User = require("../models/user");
const mongoose = require("mongoose");
const argon2 = require("argon2");

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
 *                         example: "507f1f77bcf86cd799439011"
 *                       user:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             description: Unique ID of the user
 *                             example: "507f1f77bcf86cd799439011"
 *                           firstName:
 *                             type: string
 *                             description: First name of the user
 *                             example: "John"
 *                           lastName:
 *                             type: string
 *                             description: Last name of the user
 *                             example: "Doe"
 *                           email:
 *                             type: string
 *                             format: email
 *                             description: Email of the user
 *                             example: "usuario@email.com"
 *                           phone:
 *                             type: string
 *                             description: Phone number of the user
 *                             example: "123-456-7890"
 *                           type:
 *                             type: number
 *                             description: Type of the user (1 = Student, 10 = Admin, 11 = Instructor)
 *                             example: 11
 *                           avatar:
 *                             type: string
 *                             format: url
 *                             description: URL of the user's avatar
 *                             example: "https://example.com/avatar.jpg"
 *                       ward:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             description: Unique ID of the ward
 *                             example: "507f1f77bcf86cd799439011"
 *                           name:
 *                             type: string
 *                             description: Name of the ward
 *                             example: "Ward A"
 *                           location:
 *                             type: string
 *                             description: Location of the ward
 *                             example: "Ciudad de México"
 *                           stakeId:
 *                             type: string
 *                             description: Unique ID of the stake
 *                             example: "507f1f77bcf86cd799439011"
 *       404:
 *         description: No instructors found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No instructors found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */
const getInstructors = async (req, res) => {
  try {
    const instructors = await Instructor.find().populate("userId");
    if (instructors.length === 0) {
      return res.status(404).send({
        error: "No instructors found",
      });
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
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Student ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: Image file to upload as avatar
 *               user:
 *                 type: string
 *                 description: JSON string of user object
 *                 example: >
 *                   {
 *                     "firstName": "Jane",
 *                     "lastName": "Smith",
 *                     "phone": "123-456-7890"
 *                   }
 *               wardId:
 *                 type: string
 *                 description: ID of the ward the instructor belongs to
 *                 example: "6637f39fd15b7d4b4d31a9f8"
 *     responses:
 *       201:
 *         description: The instructor was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Instructor created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       format: objectid
 *                       description: The ID of the instructor.
 *                       example: "507f1f77bcf86cd799439011"
 *                     user:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           format: objectid
 *                           description: The id of the user associated with the student
 *                           example: 5f3f9c5f6d7a0f0021e9d4b7
 *                         firstName:
 *                           type: string
 *                           description: The first name of the user
 *                           example: John
 *                         lastName:
 *                           type: string
 *                           description: The last name of the user
 *                           example: Doe
 *                         email:
 *                           type: string
 *                           description: The email of the user
 *                           example: "jhon@example.com"
 *                         phone:
 *                           type: string
 *                           description: The phone number of the user
 *                           example: 123-456-7890
 *                         type:
 *                           type: number
 *                           description: The type of the user (1 = Student, 10 = Admin, 11 = Instructor)
 *                           example: 1
 *                         avatar:
 *                           type: string
 *                           description: The URL of the user's avatar
 *                           example: https://example.com/avatar.jpg
 *                     ward:
 *                       $ref: '#/components/schemas/Ward'
 *       400:
 *         description: Bad request (e.g., invalid input, duplicate email, invalid type).
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
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

    // Hash the password
    const hashedPassword = await argon2.hash(password);

    // Create the user
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      type: 11, // Instructor type
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
 *     summary: Update an instructor by ID
 *     tags: [Instructors]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Student ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: Image file to upload as avatar
 *               user:
 *                 type: string
 *                 description: JSON string of user object
 *                 example: >
 *                   {
 *                     "firstName": "Jane",
 *                     "lastName": "Smith",
 *                     "phone": "123-456-7890"
 *                   }
 *               wardId:
 *                 type: string
 *                 description: ID of the ward the instructor belongs to
 *                 example: "6637f39fd15b7d4b4d31a9f8"
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
 *                       example: "507f1f77bcf86cd799439011"
 *                     user:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           format: objectid
 *                           description: The id of the user associated with the student
 *                           example: 5f3f9c5f6d7a0f0021e9d4b7
 *                         firstName:
 *                           type: string
 *                           description: The first name of the user
 *                           example: John
 *                         lastName:
 *                           type: string
 *                           description: The last name of the user
 *                           example: Doe
 *                         email:
 *                           type: string
 *                           description: The email of the user
 *                           example: john@doe.com
 *                         phone:
 *                           type: string
 *                           description: The phone number of the user
 *                           example: 123-456-7890
 *                         type:
 *                           type: number
 *                           description: The type of the user (1 = Student, 10 = Admin, 11 = Instructor)
 *                           example: 1
 *                         avatar:
 *                           type: string
 *                           description: The URL of the user's avatar
 *                           example: https://example.com/avatar.jpg
 *                     ward:
 *                       $ref: '#/components/schemas/Ward'
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Instructor deleted successfully"
 *       404:
 *         description: The instructor was not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "The instructor was not found"
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
