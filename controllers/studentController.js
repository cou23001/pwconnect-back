// controllers/studentController.js
const Student = require("../models/student");
const User = require("../models/user");
const Address = require("../models/address");
const TokenMetadata = require("../models/tokenMetadata");
const mongoose = require("mongoose");
const { studentSchema } = require("../validators/student");
const { partialStudentSchema } = require("../validators/partialStudent");
const { uploadToS3, deleteFromS3 } = require("../utils/upload");
const dotenv = require("dotenv");
dotenv.config();
const DEFAULT_AVATAR_URL = process.env.DEFAULT_AVATAR_URL;

/**
 * @swagger
 * tags:
 *   name: Student
 *   description: Student management
 */

/**
 * @swagger
 * /api/students:
 *   get:
 *     summary: Get all students with user and address information
 *     tags: [Student]
 *     responses:
 *       200:
 *         description: A list of students with user and address information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Students retrieved succesfully"
 *                 data:
 *                   type: array
 *                   description: List of students with user and address information
 *                   items:
 *                      type: object
 *                      properties:
 *                        _id:
 *                          type: string
 *                          format: objectid
 *                          description: The auto-generated id of the student
 *                          example: 5f3f9c5f6d7a0f0021e9d4b7
 *                        user:
 *                          type: object
 *                          properties:
 *                             _id:
 *                               type: string
 *                               format: objectid
 *                               description: The id of the user associated with the student
 *                               example: 5f3f9c5f6d7a0f0021e9d4b7
 *                             firstName:
 *                               type: string
 *                               description: The first name of the user
 *                               example: John
 *                             lastName:
 *                               type: string
 *                               description: The last name of the user
 *                               example: Doe
 *                             email:
 *                               type: string
 *                               description: The email of the user
 *                               example: john.doe@example.com
 *                             phone:
 *                               type: string
 *                               description: The phone number of the user
 *                               example: 123-456-7890
 *                             type:
 *                               type: number
 *                               description: The type of the user (1 = Student, 10 = Admin, 11 = Instructor)
 *                               example: 1
 *                             avatar:
 *                               type: string
 *                               description: The URL of the user's avatar
 *                               example: https://example.com/avatar.jpg
 *                        address:
 *                          type: object
 *                          properties:
 *                            _id:
 *                              type: string
 *                              format: objectid
 *                              description: The auto-generated id of the address
 *                              example: 5f3f9c5f6d7a0f0021e9d4b7
 *                            street:
 *                              type: string
 *                              description: The street address
 *                              example: 123 Main St.
 *                            neighborhood:
 *                              type: string
 *                              description: Neighborhood or Apartment
 *                              example: Apt. 101
 *                            city:
 *                              type: string
 *                              description: The city
 *                              example: Salt Lake City
 *                            state:
 *                              type: string
 *                              description: The state
 *                              example: UT
 *                            country:
 *                              type: string
 *                              description: The country
 *                              example: USA
 *                            postalCode:
 *                              type: string
 *                              description: The postal code
 *                              example: 84101
 *                        birthDate:
 *                          type: string
 *                          format: date
 *                          description: The date of birth of the student
 *                          example: 2000-01-01
 *                        language:
 *                          type: string
 *                          description: The language spoken by the student
 *                          example: Spanish
 *                        level:
 *                          type: string
 *                          description: The level of the student
 *                          example: EC1
 *                        churchMembership:
 *                          type: string
 *                          description: The church membership status of the student
 *                          enum: [Member, Non-member]
 *                          example: Member
 *                        createdAt:
 *                          type: string
 *                          format: date-time
 *                          description: The date and time when the student was created
 *                          example: 2020-08-20T20:00:00.000Z
 *                        updatedAt:
 *                          type: string
 *                          format: date-time
 *                          description: The date and time when the student was last updated
 *                          example: 2020-08-20T20:00:00.000Z
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "Internal server error"
 */
const getAllStudents = async (req, res) => {
  try {
    // Get students with user and address information
    const students = await Student.find()
      .populate("userId")
      .populate("addressId");
    if (students.length === 0) {
      return res.status(404).json({ message: "No students found" });
    }
    res
      .status(200)
      .json({ message: "Students retrieved succesfully", data: students });
  } catch (error) {
    res.status(500).json( "Internal server error" );
  }
};

/**
 * @swagger
 * /api/students/{id}:
 *    get:
 *      summary: Get a student by ID
 *      description: Retrieve a student by ID
 *      tags: [Student]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: Student ID
 *      responses:
 *        200:
 *          description: A student details
 *          content:
 *            application/json:
 *              schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Student retrieved successfully"
 *                 data:
 *                   type: object
 *                   description: A student with user and address information
 *                   properties:
 *                        _id:
 *                          type: string
 *                          format: objectid
 *                          description: The auto-generated id of the student
 *                          example: 5f3f9c5f6d7a0f0021e9d4b7
 *                        user:
 *                          type: object
 *                          properties:
 *                             _id:
 *                               type: string
 *                               format: objectid
 *                               description: The id of the user associated with the student
 *                               example: 5f3f9c5f6d7a0f0021e9d4b7
 *                             firstName:
 *                               type: string
 *                               description: The first name of the user
 *                               example: John
 *                             lastName:
 *                               type: string
 *                               description: The last name of the user
 *                               example: Doe
 *                             email:
 *                               type: string
 *                               description: The email of the user
 *                               example: john@doe.com
 *                             phone:
 *                               type: string
 *                               description: The phone number of the user
 *                               example: 123-456-7890
 *                             type:
 *                               type: number
 *                               description: The type of the user (1 = Student, 10 = Admin, 11 = Instructor)
 *                               example: 1
 *                             avatar:
 *                               type: string
 *                               description: The URL of the user's avatar
 *                               example: https://example.com/avatar.jpg
 *                        address:
 *                          type: object
 *                          properties:
 *                            _id:
 *                              type: string
 *                              format: objectid
 *                              description: The auto-generated id of the address
 *                              example: 5f3f9c5f6d7a0f0021e9d4b7
 *                            street:
 *                              type: string
 *                              description: The street address
 *                              example: 123 Main St.
 *                            neighborhood:
 *                              type: string
 *                              description: Neighborhood or Apartment
 *                              example: Apt. 101
 *                            city:
 *                              type: string
 *                              description: The city
 *                              example: Salt Lake City
 *                            state:
 *                              type: string
 *                              description: The state
 *                              example: UT
 *                            country:
 *                              type: string
 *                              description: The country
 *                              example: USA
 *                            postalCode:
 *                              type: string
 *                              description: The postal code
 *                              example: 84101
 *                        birthDate:
 *                          type: string
 *                          format: date
 *                          description: The date of birth of the student
 *                          example: 2000-01-01
 *                        language:
 *                          type: string
 *                          description: The language spoken by the student
 *                          example: Spanish
 *                        level:
 *                          type: string
 *                          description: The level of the student
 *                          example: EC1
 *                        churchMembership:
 *                          type: string
 *                          description: The church membership status of the student
 *                          enum: [Member, Non-member]
 *                          example: Member
 *                        createdAt:
 *                          type: string
 *                          format: date-time
 *                          description: The date and time when the student was created
 *                          example: 2020-08-20T20:00:00.000Z
 *                        updatedAt:
 *                          type: string
 *                          format: date-time
 *                          description: The date and time when the student was last updated
 *                          example: 2020-08-20T20:00:00.000Z
 *        400:
 *          description: Invalid student ID
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: "Invalid student ID"
 *        404:
 *          description: Student not found
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: "Student not found"
 *        500:
 *          description: Internal server error
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: "Internal server error"
 */
const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Validate ID format (400 Bad Request if invalid)
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid student ID" });
    }
    // 2. Find student by ID (404 Not Found if not found)
    const student = await Student.findById(id)
      .populate("userId")
      .populate("addressId");
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    // 3. Success response
    res.status(200).json({ message: "Success", data: student });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @swagger
 * /api/students/ward/{wardId}:
 *   get:
 *     summary: Get students by Ward ID (via User relationship)
 *     description: Retrieve a list of students belonging to a specific ward by matching the wardId on the associated User document.
 *     tags: [Student]
 *     parameters:
 *       - in: path
 *         name: wardId
 *         schema:
 *           type: string
 *           format: objectid
 *         required: true
 *         description: The ID of the Ward associated with the Students' User record
 *     responses:
 *       200:
 *         description: A list of students associated with the ward via their user record
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Students retrieved successfully"
 *                 data:
 *                   type: array
 *                   description: An array of student objects (potentially with populated user/address info)
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         format: objectid
 *                       birthDate:
 *                         type: string
 *                         format: date
 *                       language:
 *                         type: string
 *                       level:
 *                         type: string
 *                       churchMembership:
 *                         type: string
 *                       user:
 *                         type: object
 *                       address:
 *                         type: object
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *       400:
 *         description: Invalid Ward ID provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid Ward ID provided"
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
const getStudentsByWard = async (req, res) => {
  try {
    const { wardId } = req.params;

    if (!wardId) {
      return res.status(400).json({ message: "Ward ID parameter is required" });
    }
    if (!mongoose.isValidObjectId(wardId)) {
      return res.status(400).json({ message: "Invalid Ward ID provided" });
    }

    const wardObjectId = new mongoose.Types.ObjectId(wardId);

    const students = await Student.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'userDetails'
        }
      },
      {
        $match: {
          'userDetails.wardId': wardObjectId
        }
      },
      {
        $unwind: '$userDetails'
      },
      {
        $project: {
          _id: 1,
          birthDate: 1,
          language: 1,
          level: 1,
          churchMembership: 1,
          createdAt: 1,
          updatedAt: 1,
          user: '$userDetails',
        }
      }
    ]);

    res.status(200).json({ message: "Students retrieved successfully", data: students });
  } catch (error) {
    console.error("Error fetching students by ward:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


/**
 * @swagger
 * /api/students:
 *   post:
 *     summary: Create a new student
 *     tags: [Student]
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
 *                     "phone": "123-456-7890"
 *                   }
 *               address:
 *                 type: string
 *                 description: JSON string of address object
 *                 example: >
 *                   {
 *                     "street": "456 Elm St.",
 *                     "neighborhood": "Suite 200",
 *                     "city": "Salt Lake City",
 *                     "state": "UT",
 *                     "country": "USA",
 *                     "postalCode": "84102"
 *                   }
 *               birthDate:
 *                 type: string
 *                 format: date
 *                 description: The student's date of birth
 *                 example: "1999-01-01"
 *               language:
 *                 type: string
 *                 description: The student's preferred language
 *                 enum: [Spanish, French, Portuguese, Italian]
 *                 example: "Spanish"
 *               level:
 *                 type: string
 *                 description: The student's proficiency level
 *                 enum: [EC1, EC2]
 *                 example: "EC1"
 *               churchMembership:
 *                 type: string
 *                 description: The student's church membership status
 *                 enum: [Member, Non-member]
 *                 example: "Member"
 *     responses:
 *       201:
 *         description: Student created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message.
 *                   example: "Student created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: The ID of the student associated with the student.
 *                       example: "67def8dc21d7683620e7b62c"
 *                     user:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           description: The ID of the user associated with the student.
 *                           example: "67def8dc21d7683620e7b62c"
 *                         firstName:
 *                           type: string
 *                           description: The first name of the user.
 *                           example: "John"
 *                         lastName:
 *                           type: string
 *                           description: The last name of the user.
 *                           example: "Doe"
 *                         email:
 *                           type: string
 *                           description: The email of the user.
 *                           example: "john@doe.com"
 *                         phone:
 *                           type: string
 *                           description: The phone number of the user.
 *                           example: "520-123-2345"
 *                         type:
 *                           type: number
 *                           description: The type of the user (1 = Student, 10 = Admin, 11 = Instructor).
 *                           example: "1"
 *                         avatar:
 *                           type: string
 *                           description: The URL of the user's avatar.
 *                           example: "https://example.com/avatar.jpg"
 *                     address:
 *                       $ref: '#/components/schemas/Address'
 *                     birthDate:
 *                       type: string
 *                       format: date-time
 *                       description: The student's date of birth.
 *                       example: "1999-01-01T00:00:00.000Z"
 *                     language:
 *                       type: string
 *                       description: The student's preferred language.
 *                       example: "Spanish"
 *                     level:
 *                       type: string
 *                       description: The student's proficiency level.
 *                       example: "EC1"
 *                     churchMembership:
 *                       type: string
 *                       description: The student's church membership status.
 *                       example: "Member"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: The timestamp when the student was created.
 *                       example: "2025-03-22T17:52:28.354Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: The timestamp when the student was last updated.
 *                       example: "2025-03-22T17:52:28.354Z"
 *                     __v:
 *                       type: integer
 *                       description: The version key for the document.
 *                       example: 0
 *       400:
 *         description: Invalid request body or missing fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid request body or missing fields"
 *       404:
 *         description: Type not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Type not found"
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
 *               example:
 *                 message: "Internal server error"
 */
const createStudent = async (req, res) => {
  let session;
  let avatarUrl = null;
  let shouldCleanupFile = false;

  try {
    // Validate request body
    const { error } = studentSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details.map((err) => err.message).join(", "),
      });
    }

    session = await mongoose.startSession();
    session.startTransaction();

    // Destructure request body
    const { user, address, ...studentData } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email: user.email }).session(
      session
    );
    if (existingUser) {
      return res
        .status(400)
        .json({ message: `User '${user.email}' already exists` });
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
          type: 1, // Student type
          avatar: avatarUrl || DEFAULT_AVATAR_URL, // Use uploaded avatar or default
        },
      ],
      { session }
    );

    // Create the address
    const newAddress = await Address.create(
      [
        {
          ...address, // Spread the address object
          _id: new mongoose.Types.ObjectId(),
        },
      ],
      { session }
    );

    // Create the student
    const newStudent = await Student.create(
      [
        {
          ...studentData, // Spread the student data
          _id: new mongoose.Types.ObjectId(),
          userId: newUser[0]._id,
          addressId: newAddress[0]._id,
        },
      ],
      { session }
    );

    // Commit the transaction
    await session.commitTransaction();
    shouldCleanupFile = false; // Reset cleanup flag

    // Populate the student data before sending response
    const result = await Student.findById(newStudent[0]._id)
      .populate("userId", "-password") // Exclude password field
      .populate("addressId")
      .lean(); // Convert to plain JavaScript object

    // Send response
    res.status(201).json({
      success: true,
      message: "Student created successfully",
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
        : "Student creation failed",
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
 * /api/students/{id}:
 *   put:
 *     summary: Update a student by ID
 *     tags: [Student]
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
 *               address:
 *                 type: string
 *                 description: JSON string of address object
 *                 example: >
 *                   {
 *                     "street": "456 Elm St.",
 *                     "neighborhood": "Suite 200",
 *                     "city": "Salt Lake City",
 *                     "state": "UT",
 *                     "country": "USA",
 *                     "postalCode": "84102"
 *                   }
 *               birthDate:
 *                 type: string
 *                 format: date
 *                 description: The student's date of birth
 *                 example: "1999-01-01"
 *               language:
 *                 type: string
 *                 description: The student's preferred language
 *                 enum: [Spanish, French, Portuguese, Italian]
 *                 example: "Spanish"
 *               level:
 *                 type: string
 *                 description: The student's proficiency level
 *                 enum: [EC1, EC2]
 *                 example: "EC1"
 *               churchMembership:
 *                 type: string
 *                 description: The student's church membership status
 *                 enum: [Member, Non-member]
 *                 example: "Member"
 *     responses:
 *       200:
 *         description: Student updated successfully
 *         content:
 *            application/json:
 *              schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message
 *                   example: "Student updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                        _id:
 *                          type: string
 *                          format: objectid
 *                          description: The auto-generated id of the student
 *                          example: 5f3f9c5f6d7a0f0021e9d4b7
 *                        user:
 *                          type: object
 *                          properties:
 *                             _id:
 *                               type: string
 *                               format: objectid
 *                               description: The id of the user associated with the student
 *                               example: 5f3f9c5f6d7a0f0021e9d4b7
 *                             firstName:
 *                               type: string
 *                               description: The first name of the user
 *                               example: John
 *                             lastName:
 *                               type: string
 *                               description: The last name of the user
 *                               example: Doe
 *                             email:
 *                               type: string
 *                               description: The email of the user
 *                               example: john@doe.com
 *                             phone:
 *                               type: string
 *                               description: The phone number of the user
 *                               example: 123-456-7890
 *                             type:
 *                               type: number
 *                               description: The type of the user (1 = Student, 10 = Admin, 11 = Instructor)
 *                               example: 1
 *                             avatar:
 *                               type: string
 *                               description: The URL of the user's avatar
 *                               example: https://example.com/avatar.jpg
 *                        address:
 *                          type: object
 *                          properties:
 *                            _id:
 *                              type: string
 *                              format: objectid
 *                              description: The auto-generated id of the address
 *                              example: 5f3f9c5f6d7a0f0021e9d4b7
 *                            street:
 *                              type: string
 *                              description: The street address
 *                              example: 123 Main St.
 *                            neighborhood:
 *                              type: string
 *                              description: Neighborhood or Apartment
 *                              example: Apt. 101
 *                            city:
 *                              type: string
 *                              description: The city
 *                              example: Salt Lake City
 *                            state:
 *                              type: string
 *                              description: The state
 *                              example: UT
 *                            country:
 *                              type: string
 *                              description: The country
 *                              example: USA
 *                            postalCode:
 *                              type: string
 *                              description: The postal code
 *                              example: 84101
 *                        birthDate:
 *                          type: string
 *                          format: date
 *                          description: The date of birth of the student
 *                          example: 2000-01-01
 *                        language:
 *                          type: string
 *                          description: The language spoken by the student
 *                          example: Spanish
 *                        level:
 *                          type: string
 *                          description: The level of the student
 *                          example: EC1
 *                        churchMembership:
 *                          type: string
 *                          description: The church membership status of the student
 *                          enum: [Member, Non-member]
 *                          example: Member
 *       400:
 *         description: Invalid student ID or missing fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid student ID or missing fields"
 *       404:
 *         description: Student not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Student not found"
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
const updateStudent = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    // 1. Validate ID format
    if (!mongoose.isValidObjectId(id)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Invalid student ID" });
    }
    // 1. Fetch student with populated user
    const student = await Student.findById(id)
      .populate("userId")
      .session(session);

    if (!student || !student.userId) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Student or user not found" });
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
      oldAvatarUrl = student.userId.avatar;

      // Upload new avatar
      const newAvatarUrl = await uploadToS3(req.file);
      req.body.user = req.body.user || {};
      req.body.user.avatar = newAvatarUrl;
    }

    // 3. Validate request body
    const { error } = partialStudentSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        message: error.details.map((err) => err.message).join(", "),
      });
    }

    // 4. Update User (including new avatar if uploaded)
    if (req.body.user) {
      await User.findByIdAndUpdate(
        student.userId._id,
        { $set: req.body.user },
        { session }
      );
    }

    // 5. Update Address
    if (req.body.address) {
      const address = await Address.findOneAndUpdate(
        { _id: student.addressId || new mongoose.Types.ObjectId() },
        { $set: req.body.address },
        { upsert: true, session, new: true }
      );
      student.addressId = address._id;
      await student.save({ session });
    }

    // 6. Update Student
    const { user, address, ...studentFields } = req.body;
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      { $set: studentFields },
      { new: true, session }
    )
      .populate("userId")
      .populate("addressId");

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
      message: "Student updated successfully",
      data: updatedStudent,
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
 * /api/students/{id}:
 *   delete:
 *     summary: Delete a student by ID
 *     tags: [Student]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Student ID
 *     responses:
 *       200:
 *         description: Student deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Student and linked data deleted"
 *                 deletedIds:
 *                   type: object
 *                   properties:
 *                     studentId:
 *                       type: string
 *                       description: The ID of the deleted student
 *                       example: "5f3f9c5f6d7a0f0021e9d4b7"
 *                     userId:
 *                       type: string
 *                       description: The ID of the deleted user
 *                       example: "5f3f9c5f6d7a0f0021e9d4b7"
 *                     addressId:
 *                       type: string
 *                       description: The ID of the deleted address
 *                       example: "5f3f9c5f6d7a0f0021e9d4b7"
 *                     tokenMetadataId:
 *                       type: string
 *                       description: The ID of the deleted token metadata
 *                       example: "5f3f9c5f6d7a0f0021e9d4b7"
 *       400:
 *         description: Invalid student ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid student ID"
 *       404:
 *         description: Student not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Student not found"
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
const deleteStudent = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid student ID",
    });
  }

  const MAX_RETRIES = 3;
  let retryCount = 0;
  let done = false;
  let userAvatarUrl = null;

  while (!done && retryCount < MAX_RETRIES) {
    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      // Find student within the transaction session
      const student = await Student.findById(id).session(session);
      if (!student) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({
          success: false,
          message: "Student not found",
        });
      }

      // Optionally get user data before deletion (for avatar cleanup)
      const user = student.userId
        ? await User.findById(student.userId).session(session)
        : null;

      if (user) {
        userAvatarUrl = user?.avatar; // save the avatar URL
      }

      const tkMetaData = await TokenMetadata.findOne({
        userId: student.userId,
      }).session(session);

      // Prepare deletion operations
      const deletions = [student.deleteOne({ session })];

      if (student.userId) {
        deletions.push(User.deleteOne({ _id: student.userId }, { session }));
      }

      if (student.addressId) {
        deletions.push(
          Address.deleteOne({ _id: student.addressId }, { session })
        );
      }

      if (tkMetaData) {
        deletions.push(
          TokenMetadata.deleteOne({ userId: student.userId }, { session })
        );
      }

      // Execute all deletions
      await Promise.all(deletions);

      // Commit transaction and end session after DB operations
      await session.commitTransaction();
      session.endSession();
      done = true;

      //Checking if we need to delete avatar from S3
      if (
        userAvatarUrl &&
        userAvatarUrl.startsWith("https://") &&
        userAvatarUrl.includes("s3.amazonaws.com") &&
        !userAvatarUrl.includes("avatar/default")
      ) {
        await deleteFromS3(userAvatarUrl).catch((err) => {
          console.error(`Failed to delete avatar for user ${user._id}:`, err);
        });
      }

      return res.status(200).json({
        success: true,
        message: "Student and linked data deleted",
        deletedIds: {
          studentId: student._id,
          userId: student.userId,
          addressId: student.addressId,
          tokenMetadataId: tkMetaData ? tkMetaData._id : null,
        },
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      retryCount++;

      if (retryCount >= MAX_RETRIES) {
        return res.status(500).json({
          success: false,
          message: "Deletion failed after multiple attempts",
          error:
            process.env.NODE_ENV === "development" ? error.message : undefined,
        });
      }

      // Wait a tiny bit before retrying (helps with race conditions)
      await new Promise((res) => setTimeout(res, 100));
    }
  }
};



// function to upload avatar to S3
/**
 * @swagger
 * /api/students/upload/{id}:
 *   put:
 *     summary: Upload an avatar
 *     tags: [Student]
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
 *     responses:
 *       200:
 *         description: Avatar uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Avatar uploaded successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     url:
 *                       type: string
 *                       description: The URL of the uploaded avatar
 *                       example: "https://example.com/avatar.jpg"
 *                     size:
 *                       type: integer
 *                       description: The size of the uploaded file in bytes
 *                       example: 204800
 *                     type:
 *                       type: string
 *                       description: The MIME type of the uploaded file
 *                       example: "image/jpeg"
 *       400:
 *         description: Invalid file type or size
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid file type or size"
 *       404:
 *         description: Student not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Student not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Avatar upload failed"
 *                 error:
 *                   type: string
 *                   example: "Error message"
 *                 allowedTypes:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["image/jpeg", "image/png", "image/webp"]
 *                 maxSize:
 *                   type: string
 *                   example: "2MB"
 */
const uploadAvatar = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const avatar = req.file;
    const MAX_SIZE = 2 * 1024 * 1024; // 2MB
    const validTypes = ["image/jpeg", "image/png", "image/webp"];

    // Validate student exists
    const student = await Student.findById(id)
      .populate("userId")
      .session(session);
    if (!student?.userId) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Validate file exists
    if (!avatar) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    // Validate file type
    if (!validTypes.includes(avatar.mimetype)) {
      return res.status(400).json({
        success: false,
        message: "Only JPEG, PNG, or WebP images allowed",
      });
    }

    // Validate file size
    if (avatar.size > MAX_SIZE) {
      return res.status(413).json({
        success: false,
        message: "File exceeds 2MB limit",
      });
    }

    // Upload new avatar
    const avatarUrl = await uploadToS3(avatar);
    // Validate upload success
    if (!avatarUrl) {
      return res.status(500).json({
        success: false,
        message: "Avatar upload failed",
      });
    }

    // Save old avatar URL for cleanup
    const oldAvatar = student.userId.avatar;

    // Update user's avatar
    await User.updateOne(
      { _id: student.userId._id },
      { avatar: avatarUrl },
      { session }
    );

    await session.commitTransaction();

    if (oldAvatar) {
      const isDefaultAvatar =
        new URL(oldAvatar).pathname === new URL(DEFAULT_AVATAR_URL).pathname;

      if (!isDefaultAvatar) {
        try {
          await deleteFromS3(oldAvatar);
        } catch (err) {
          return res.status(500).json({
            success: false,
            message: `Failed to delete avatar (${oldAvatar}):`,
            error: err.message,
          });
        }
      }
    }
    res.status(200).json({
      success: true,
      message: "Avatar uploaded successfully",
      data: {
        url: avatarUrl,
        size: avatar.size,
        type: avatar.mimetype,
      },
    });
  } catch (error) {
    await session.abortTransaction();

    res.status(500).json({
      success: false,
      message: "Avatar upload failed",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  } finally {
    session.endSession();
  }
};

/**
 * @swagger
 * /api/students/user/{userId}:
 *   get:
 *     summary: Get a student by user ID
 *     tags: [Student]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: Student found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: The ID of the student.
 *                       example: "67def8dc21d7683620e7b62c"
 *                     userId:
 *                       $ref: '#/components/schemas/UserResponse'
 *                     addressId:
 *                       $ref: '#/components/schemas/Address'
 */
const getStudentByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    // Validate ID format
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    const student = await Student.findOne({ userId })
    .populate({
      path: 'userId',
      populate: {
        path: 'wardId',
        populate: {
          path: 'stakeId'
        }
      }
    })
    .populate('addressId');
    
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json({ message: 'Student found', data: student });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};


module.exports = {
  getAllStudents,
  getStudentById,
  getStudentsByWard,
  createStudent,
  updateStudent,
  deleteStudent,
  uploadAvatar,
  getStudentByUserId,
};
