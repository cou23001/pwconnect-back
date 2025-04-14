// controllers/instructorController.js
const Instructor = require("../models/instructor");
const User = require("../models/user");
const mongoose = require("mongoose");
const {
  instructorSchema,
  partialInstructorSchema,
} = require("../validators/instructor");
const { uploadToS3, deleteFromS3 } = require("../utils/upload");
const dotenv = require("dotenv");
dotenv.config();
const DEFAULT_AVATAR_URL = process.env.DEFAULT_AVATAR_URL;

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
    const instructors = await Instructor.find()
      .populate("userId")
      .populate("wardId");
    if (instructors.length === 0) {
      return res.status(404).send({
        error: "No instructors found",
      });
    }

    res.status(200).json({ message: "Instructors found", data: instructors });
  } catch (error) {
    res
      .status(500)
      .send({ error: "Internal Server Error", details: error.message });
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
 *                       example: "507f1f77bcf86cd799439011"
 *                     user:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           format: objectid
 *                           description: The id of the user associated with the instructor
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
 *                           example: 11
 *                         avatar:
 *                           type: string
 *                           description: The URL of the user's avatar
 *                           example: https://example.com/avatar.jpg
 *                     ward:
 *                       $ref: '#/components/schemas/Ward'
 *       400:
 *         description: Invalid instructor ID format.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid instructor ID"
 *       404:
 *         description: The instructor was not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Instructor not found"
 *       500:
 *         description: Internal server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */
const getInstructorById = async (req, res) => {
  try {
    //Validate body
    const { error } = instructorSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        message: error.details.map((err) => err.message).join(", "),
      });
    }

    // Find the instructor by ID and populate the userId, wardId field
    const instructor = await Instructor.findById(id)
      .populate("userId")
      .populate("wardId");

    if (!instructor) {
      return res.status(404).send({ error: "Instructor not found" });
    }

    // Send the response
    res.status(200).json({ message: "Instructor found", data: instructor });
  } catch (error) {
    console.error("Error fetching instructor:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};


/**
 * @swagger
 * /api/instructors/wards/{wardId}:
 *   get:
 *     summary: Get all instructors for a specific ward
 *     tags: [Instructors]
 *     parameters:
 *       - in: path
 *         name: wardId
 *         schema:
 *           type: string
 *           format: objectid
 *         required: true
 *         description: The ID of the ward to fetch instructors for.
 *     responses:
 *       200:
 *         description: A list of instructors in the specified ward.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Instructors found for this ward"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         format: objectid
 *                         description: The ID of the instructor.
 *                         example: "507f1f77bcf86cd799439011"
 *                       userId:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             format: objectid
 *                             description: The id of the user associated with the instructor
 *                             example: "5f3f9c5f6d7a0f0021e9d4b7"
 *                           firstName:
 *                             type: string
 *                             description: The first name of the user
 *                             example: "Jane"
 *                           lastName:
 *                             type: string
 *                             description: The last name of the user
 *                             example: "Smith"
 *                           email:
 *                             type: string
 *                             description: The email of the user
 *                             example: "jane@smith.com"
 *                           type:
 *                             type: number
 *                             description: The type of the user (1 = Student, 10 = Admin, 11 = Instructor)
 *                             example: 11
 *                           avatar:
 *                             type: string
 *                             description: The URL of the user's avatar
 *                             example: "https://example.com/jane_avatar.jpg"
 *                       wardId:
 *                         $ref: '#/components/schemas/Ward'
 *       400:
 *         description: Invalid ward ID format.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid ward ID"
 *       404:
 *         description: No instructors found for the specified ward.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No instructors found for this ward"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */


const getInstructorsByWard = async (req, res) => {
  try {
    const { wardId } = req.params;

    // Validate the wardId
    if (!mongoose.Types.ObjectId.isValid(wardId)) {
      return res.status(400).json({ error: "Invalid ward ID" });
    }

    // Fetch instructors
    const instructors = await Instructor.find({ wardId })
      .populate("userId", "-password")
      .populate("wardId");

    if (!instructors || instructors.length === 0) {
      return res.status(404).json({ error: "No instructors found for this ward" });
    }

    res.status(200).json({
      message: "Instructors found for this ward",
      data: instructors,
    });
  } catch (error) {
    console.error("Error fetching instructors by ward:", error);
    res.status(500).json({
      error: "Internal Server Error",
      details: error.message,
    });
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
 *                     "email": "jsmith@example.com",
 *                     "password": "password123",
 *                     "phone": "123-456-7890"
 *                    }
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
 *                           description: The id of the user associated with the instructor
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
 */
const createInstructor = async (req, res) => {
  let session;
  let avatarUrl = null;
  let shouldCleanupFile = false;

  try {
    //Validate the request body
    const { error } = instructorSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details.map((err) => err.message).join(", "),
      });
    }

    session = await mongoose.startSession();
    session.startTransaction();

    // Destructure request body
    const { user, wardId } = req.body;

    // Check if the email is already registered
    const existingUser = await User.findOne({ email: user.email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Handle file upload if present
    if (req.file) {
      avatarUrl = await uploadToS3(req.file);
      shouldCleanupFile = true; // Set cleanup flag
    }

    // Create the user
    const newUser = await User.create(
      [
        {
          ...user, // Spread the user object
          _id: new mongoose.Types.ObjectId(),
          password: user.password,
          type: 11, // Student type
          avatar: avatarUrl || DEFAULT_AVATAR_URL, // Use uploaded avatar or default
        },
      ],
      { session }
    );

    // Create the instructor
    const newInstructor = await Instructor.create(
      [
        {
          _id: new mongoose.Types.ObjectId(),
          userId: newUser[0]._id,
          wardId,
        },
      ],
      { session }
    );

    // Commit the transaction
    await session.commitTransaction();
    shouldCleanupFile = false; // Reset cleanup flag
    //session.endSession();

    // Populate the instructor data before sending response
    const result = await Instructor.findById(newInstructor[0]._id)
      .populate("userId", "-password") // Exclude password field
      .populate("wardId")
      .lean(); // Convert to plain JavaScript object

    // Respond with the instructor
    res.status(201).json({
      success: true,
      message: "Instructor created successfully",
      data: {
        ...result,
      },
    });
  } catch (error) {
    // Cleanup uploaded file if anything failed
    if (shouldCleanupFile && avatarUrl) {
      await deleteFromS3(avatarUrl).catch((err) =>
        console.error("Failed to cleanup uploaded file:", err)
      );
    }

    if (session?.inTransaction()) {
      await session.abortTransaction();
    }

    const status = error.message.includes("already exists") ? 409 : 500;
    res.status(status).json({
      success: false,
      message: error.message.includes("already exists")
        ? error.message
        : "Instructor creation failed",
      ...(process.env.NODE_ENV === "development" && { error: error.message }),
    });
  } finally {
    if (session) {
      session.endSession();
    }
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
 *         description: Instructor ID
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
 *                           description: The id of the user associated with the instructor
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
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).send("Invalid instructor ID");
    }
    // Find the instructor
    const instructor = await Instructor.findById(id)
      .populate("userId")
      .populate("wardId")
      .session(session);

    if (!instructor || !instructor.userId) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "The instructor was not found" });
    }

    let oldAvatarUrl = null;

    // 2. Handle file upload if present
    if (req.file) {
      // Validate type (redundant check)
      const validTypes = ["image/jpeg", "image/png"];
      if (!validTypes.includes(req.file.mimetype)) {
        return res.status(400).json({ message: "Invalid file type" });
      }
      // Check if the file is too large
      if (req.file.size > 2 * 1024 * 1024) {
        // 2MB limit
        return res.status(400).json({ message: "File size exceeds limit" });
      }
      // Store old avatar URL for cleanup
      oldAvatarUrl = instructor.userId.avatar;

      // Upload new avatar
      const newAvatarUrl = await uploadToS3(req.file);
      req.body.user = req.body.user || {};
      req.body.user.avatar = newAvatarUrl;
    }

    // 3. Validate request body
    const { error } = partialInstructorSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      console.error("Validation error:", error.details);
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        message: error.details.map((err) => err.message).join(", "),
      });
    }

    // 4. Update User (including new avatar if uploaded)
    if (req.body.user) {
      await User.findByIdAndUpdate(
        instructor.userId._id,
        { $set: req.body.user },
        { session }
      );
    }

    // 6. Update Instructor
    const { user, wardId } = req.body;
    const updatedInstructor = await Instructor.findByIdAndUpdate(
      req.params.id,
      { $set: { wardId } },
      { new: true, session }
    )
      .populate("userId")
      .populate("wardId");

    // 7. Commit transaction
    await session.commitTransaction();
    session.endSession();

    // 8. Cleanup old avatar AFTER successful commit
    if (oldAvatarUrl && oldAvatarUrl !== DEFAULT_AVATAR_URL) {
      try {
        await deleteFromS3(oldAvatarUrl);
      } catch (err) {
        console.error("Error deleting old avatar (non-critical):", err);
      }
    }

    return res.status(200).json({
      message: "Instructor updated successfully",
      data: updatedInstructor,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    // Cleanup new avatar if transaction failed
    if (req.file && req.body.user?.avatar) {
      await deleteFromS3(req.body.user.avatar).catch(console.error);
    }

    return res.status(500).json({
      message: "Update failed",
      ...(process.env.NODE_ENV === "development" && { error: error.message }),
    });
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

  let avatarToDelete = null;
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({ error: "Invalid ID format" });
    }
    
    // Find the instructor
    const instructor = await Instructor.findById(id).session(session);
    if (!instructor) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).send({ error: "Instructor not found" });
    }

    const user = await User.findById(instructor.userId).session(session);
    if (user?.avatar && user.avatar !== DEFAULT_AVATAR_URL) {
      avatarToDelete = user.avatar; // defer deletion
    }

    await User.findByIdAndDelete(instructor.userId).session(session);
    await Instructor.findByIdAndDelete(id).session(session);

    await session.commitTransaction();
    session.endSession();

    // Delete image only after DB changes are committed
    if (avatarToDelete) {
      try {
        await deleteFromS3(avatarToDelete);
      } catch (s3Err) {
        console.warn("S3 deletion failed, but DB is consistent:", s3Err.message);
        // Optionally log this somewhere for cleanup later
      }
    }

    return res.status(200).json({ message: "Instructor deleted successfully" });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error deleting instructor:", error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};


module.exports = {
  getInstructors,
  createInstructor,
  getInstructorById,
  getInstructorsByWard,
  updateInstructor,
  deleteInstructor,
};
