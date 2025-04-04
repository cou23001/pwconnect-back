// controllers/studentController.js
const Student = require("../models/student");
const User = require("../models/user");
const Address = require("../models/address");
const mongoose = require("mongoose");
const studentSchema = require("../validators/student");
const partialStudentSchema = require("../validators/partialStudent");
const { uploadToS3, deleteFromS3 } = require("../utils/upload");
const defaultAvatarUrl = process.env.DEFAULT_AVATAR_URL

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
 *                        phone:
 *                          type: string
 *                          description: The phone number of the student
 *                          example: 123-456-7890
 *                        language:
 *                          type: string
 *                          description: The language spoken by the student
 *                          example: Spanish
 *                        level:
 *                          type: string
 *                          description: The level of the student
 *                          example: EC1
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
    res.status(500).json({ message: error.message });
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
 *                        phone:
 *                          type: string
 *                          description: The phone number of the student
 *                          example: 123-456-7890
 *                        language:
 *                          type: string
 *                          description: The language spoken by the student
 *                          example: Spanish
 *                        level:
 *                          type: string
 *                          description: The level of the student
 *                          example: EC1
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
    const student = await Student.findById(req.params.id)
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
 * /api/students:
 *   post:
 *     summary: Create a student
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
 *                     "email": "joe@example.com",
 *                     "password": "password123"
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
 *               phone:
 *                 type: string
 *                 description: The student's phone number
 *                 example: "520-123-2345"
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
 *                     id:
 *                       type: string
 *                       description: The ID of the user associated with the student.
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
 *                     phone:
 *                       type: string
 *                       description: The student's phone number.
 *                       example: "520-123-2345"
 *                     language:
 *                       type: string
 *                       description: The student's preferred language.
 *                       example: "Spanish"
 *                     level:
 *                       type: string
 *                       description: The student's proficiency level.
 *                       example: "EC1"
 *                     _id:
 *                       type: string
 *                       description: The auto-generated ID of the student.
 *                       example: "67def8dc21d7683620e7b632"
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
    const existingUser = await User.findOne({ email: user.email }).session(session);
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
    const newUser = await User.create([{
      ...user, // Spread the user object
      _id: new mongoose.Types.ObjectId(),
      password: user.password,
      type: 1, // Student type
      avatar:  avatarUrl || defaultAvatarUrl, // Use uploaded avatar or default
    }], { session });

    // Create the address
    const newAddress = await Address.create([{
      ...address, // Spread the address object
      _id: new mongoose.Types.ObjectId(),
    }], { session });

    // Create the student
    const newStudent = await Student.create([{
      ...studentData, // Spread the student data
      _id: new mongoose.Types.ObjectId(),
      userId: newUser[0]._id,
      addressId: newAddress[0]._id
    }], { session });

    // Commit the transaction
    await session.commitTransaction();
    shouldCleanupFile = false; // Reset cleanup flag

    // Populate the student data before sending response
    const result = await Student.findById(newStudent[0]._id)
      .populate('userId', '-password')  // Exclude password field
      .populate('addressId')
      .lean();  // Convert to plain JavaScript object

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
      await deleteFromS3(avatarUrl).catch(err => 
        console.error('Failed to cleanup uploaded file:', err)
      );
    }

    if (session?.inTransaction()) {
      await session.abortTransaction();
    }

    const status = error.message.includes('already exists') ? 409 : 500;
    res.status(status).json({
      success: false,
      message: error.message.includes('already exists') 
        ? error.message 
        : 'Student creation failed',
      ...(process.env.NODE_ENV === 'development' && { error: error.message })
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
 *                     "email": "joe@example.com"
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
 *               phone:
 *                 type: string
 *                 description: The student's phone number
 *                 example: "520-123-2345"
 *               language:
 *                 type: string
 *                 description: The student's preferred language
 *                 enum: [Spanish, French, Portuguese, Italian]
 *                 example: "Spanish"
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
 *                        phone:
 *                          type: string
 *                          description: The phone number of the student
 *                          example: 123-456-7890
 *                        language:
 *                          type: string
 *                          description: The language spoken by the student
 *                          example: Spanish
 *                        level:
 *                          type: string
 *                          description: The level of the student
 *                          example: EC1
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
    // 1. Fetch student with populated user
    const student = await Student.findById(req.params.id)
      .populate('userId')
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
      const validTypes = ['image/jpeg', 'image/png'];
      if (!validTypes.includes(req.file.mimetype)) {
        return res.status(400).json({ message: 'Invalid file type' });
      }
      // Check if the file is too large
      if (req.file.size > 2 * 1024 * 1024) { // 2MB limit
        return res.status(400).json({ message: 'File size exceeds limit' });
      }
      // Store old avatar URL for cleanup
      oldAvatarUrl = student.userId.avatar;
      
      // Upload new avatar
      const newAvatarUrl = await uploadToS3(req.file);
      req.body.user = req.body.user || {};
      req.body.user.avatar = newAvatarUrl;
    }

    // 3. Validate request body
    const { error } = partialStudentSchema.validate(req.body, { abortEarly: false });
    if (error) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        message: error.details.map(err => err.message).join(", ")
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
      .populate('userId')
      .populate('addressId');

    // 7. Commit transaction
    await session.commitTransaction();
    session.endSession();

    // 8. Cleanup old avatar AFTER successful commit
    if (oldAvatarUrl && !oldAvatarUrl.includes('default-avatar')) {
      try {
        await deleteFromS3(oldAvatarUrl);
      } catch (err) {
        console.error('Error deleting old avatar (non-critical):', err);
      }
    }

    return res.status(200).json({
      message: "Student updated successfully",
      data: updatedStudent
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
      ...(process.env.NODE_ENV === 'development' && { error: error.message })
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
 *                 message:
 *                   type: string
 *                   example: "Student deleted"
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
  const session = await mongoose.startSession();
  try {
    const { id } = req.params;

    // 1. Validate ID format (400 Bad Request if invalid)
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID" 
      });
    }

    // 2. Find the student first (to ensure it exists)
    const student = await Student.findById(id).session(session);
    if (!student) {
      return res.status(404).json({ 
        success: false,
        message: "Student not found" });
    }

    session.startTransaction();

    // Get user data before deletion for avatar cleanup
    const user = student.userId 
      ? await User.findById(student.userId).session(session)
      : null;

    // Parallel deletions in transaction
    await Promise.all([
      User.deleteOne({ _id: student.userId }, { session }),
      Address.deleteOne({ _id: student.addressId }, { session }),
      student.deleteOne({ session })
    ]);

    // Cleanup avatar if exists
    if (user?.avatar) {
      await deleteFromS3(user.avatar).catch(err => 
        console.error('Avatar cleanup failed:', err)
      );
    }

    // Commit transaction
    await session.commitTransaction();

    // Response
    res.status(200).json({
      success: true,
      message: "Student and linked data deleted",
      deletedIds: {
        studentId: student._id,
        userId: student.userId,
        addressId: student.addressId
      }
    });
  } catch (error) {
    await session.abortTransaction();
    
    res.status(500).json({
      success: false,
      message: "Deletion failed",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    session.endSession();
  }
};

// function to upload avatar to S3
const uploadAvatar = async (req, res) => {
  try {
    const avatar = req.file;
    const MAX_SIZE = 2 * 1024 * 1024; // 2MB
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (!avatar) {
      return res.status(400).json({ 
        success: false,
        message: "No file uploaded" 
      });
    }

    if (!validTypes.includes(avatar.mimetype)) {
      return res.status(400).json({ 
        success: false,
        message: "Only JPEG, PNG, or WebP images allowed",
        allowedTypes: validTypes
      });
    }

    if (avatar.size > MAX_SIZE) {
      return res.status(413).json({ 
        success: false,
        message: "File exceeds 2MB limit" 
      });
    }

    const avatarUrl = await uploadToS3(avatar);
    
    res.status(200).json({
      success: true,
      message: "Avatar uploaded successfully",
      data: {
        url: avatarUrl,
        size: avatar.size,
        type: avatar.mimetype
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Avatar upload failed",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  uploadAvatar,
};
