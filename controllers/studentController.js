// controllers/studentController.js
const Student = require("../models/student");
const User = require("../models/user");
const Address = require("../models/address");
const mongoose = require("mongoose");
const UserRole = require("../models/userRole");
const studentSchema = require("../validators/student");
const partialStudentSchema = require("../validators/partialStudent");

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
 *     summary: Create a new student
 *     description: Creates a new student with associated user account and address
 *     tags: [Student]
 *     requestBody:
 *       required: true
 *       description: Student creation data
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user
 *               - address
 *               - birthDate
 *               - phone
 *               - language
 *               - level
 *             properties:
 *               user:
 *                 type: object
 *                 required:
 *                   - firstName
 *                   - lastName
 *                   - email
 *                   - password
 *                 properties:
 *                   firstName:
 *                     type: string
 *                     minLength: 2
 *                     maxLength: 50
 *                     example: "John"
 *                   lastName:
 *                     type: string
 *                     minLength: 2
 *                     maxLength: 50
 *                     example: "Doe"
 *                   email:
 *                     type: string
 *                     format: email
 *                     example: "john.doe@example.com"
 *                   password:
 *                     type: string
 *                     format: password
 *                     minLength: 8
 *                     example: "securePassword123"
 *                   role:
 *                     type: string
 *                     default: "student"
 *                     example: "student"
 *               address:
 *                 type: object
 *                 required:
 *                   - street
 *                   - city
 *                   - state
 *                   - country
 *                   - postalCode
 *                 properties:
 *                   street:
 *                     type: string
 *                     example: "123 Main St."
 *                   neighborhood:
 *                     type: string
 *                     example: "Apt 101"
 *                   city:
 *                     type: string
 *                     example: "Salt Lake City"
 *                   state:
 *                     type: string
 *                     minLength: 2
 *                     maxLength: 2
 *                     example: "UT"
 *                   country:
 *                     type: string
 *                     example: "USA"
 *                   postalCode:
 *                     type: string
 *                     example: "84101"
 *               birthDate:
 *                 type: string
 *                 format: date
 *                 example: "2000-01-01"
 *               phone:
 *                 type: string
 *                 pattern: '^[\d\-\(\) ]+$'
 *                 example: "123-456-7890"
 *               language:
 *                 type: string
 *                 enum: [Spanish, Portuguese, French]
 *                 example: "Spanish"
 *               level:
 *                 type: string
 *                 example: "EC1"
 *             example:
 *               user:
 *                 firstName: "John"
 *                 lastName: "Doe"
 *                 email: "john.doe@example.com"
 *                 password: "securePassword123"
 *               address:
 *                 street: "123 Main St."
 *                 neighborhood: "Apt 101"
 *                 city: "Salt Lake City"
 *                 state: "UT"
 *                 country: "USA"
 *                 postalCode: "84101"
 *               birthDate: "2000-01-01"
 *               phone: "123-456-7890"
 *               language: "Spanish"
 *               level: "EC1"
 *     responses:
 *       201:
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
 *                         roleId:
 *                           type: string
 *                           description: The role Id of the user.
 *                           example: "67def8dc21d7683620e7b62c"
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
 *         description: Role not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Role not found"
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
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Validate request body using Joi
    const { error, value } = studentSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        message: error.details.map((err) => err.message).join(", "),
      });
    }

    // Destructure request body
    const { user, address, birthDate, phone, language, level } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email: user.email }).session(
      session
    );
    if (existingUser) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ message: `User '${user.email}' already exists` });
    }

    // Fetch the role
    const userRole = await UserRole.findOne({ name: "student" }).session(
      session
    );
    if (!userRole) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Role not found" });
    }

    // Create the user
    const newUser = new User({
      _id: new mongoose.Types.ObjectId(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
      role: userRole._id,
    });
    await newUser.save({ session });

    // Create the address
    const newAddress = new Address({
      _id: new mongoose.Types.ObjectId(),
      street: address.street,
      neighborhood: address.neighborhood,
      city: address.city,
      state: address.state,
      country: address.country,
      postalCode: address.postalCode,
    });
    await newAddress.save({ session });

    // Create the student
    const newStudent = new Student({
      _id: new mongoose.Types.ObjectId(),
      userId: newUser._id,
      addressId: newAddress._id,
      birthDate,
      phone,
      language,
      level,
    });
    await newStudent.save({ session });

    // Commit the transaction
    await session.commitTransaction();

    // Populate the student data before sending response
    const populatedStudent = await Student.findById(newStudent._id)
      .populate('userId', '-password')  // Exclude password field
      .populate('addressId')
      .lean();  // Convert to plain JavaScript object

    session.endSession();

    // Send response
    res.status(201).json({
      message: "Student created successfully",
      data: populatedStudent,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: error.message });
  }
};

/**
 * @swagger
 * /api/students/{id}:
 *   put:
 *     summary: Update a student by ID
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
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                  type: object
 *                  properties:
 *                      firstName:
 *                          type: string
 *                          description: Updated first name of the student
 *                      lastName:
 *                          type: string
 *                          description: Updated last name of the student
 *                      email:
 *                          type: string
 *                          format: email
 *                          description: Updated email of the student
 *               address:
 *                 type: object
 *                 properties:
 *                   street:
 *                     type: string
 *                     description: Updated street address
 *                   neighborhood:
 *                     type: string
 *                     description: Updated neighborhood or apartment
 *                   city:
 *                     type: string
 *                     description: Updated city
 *                   state:
 *                     type: string
 *                     description: Updated state
 *                   country:
 *                     type: string
 *                     description: Updated country
 *                   postalCode:
 *                     type: string
 *                     description: Updated postal code
 *               birthDate:
 *                 type: string
 *                 format: date
 *                 description: Updated date of birth of the student
 *               phone:
 *                 type: string
 *                 description: Updated phone number of the student
 *               language:
 *                 type: string
 *                 description: Updated language spoken by the student
 *               level:
 *                 type: string
 *                 description: Updated level of the student
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
const updateStudent = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Validate request body using Joi
    const { error, value } = partialStudentSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        message: error.details.map((err) => err.message).join(", "),
      });
    }

    // Find the student first
    let student = await Student.findById(req.params.id).session(session);

    if (!student) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Student not found" });
    }

    // Update User if provided
    if (req.body.user) {
      await User.findByIdAndUpdate(
        student.userId,
        { $set: req.body.user }, // Only updates provided fields
        { session, new: true }
      );
    }

    // Update Address if provided
    if (req.body.address) {
      await Address.findByIdAndUpdate(
        student.addressId,
        { $set: req.body.address }, // Only updates provided fields
        { session, new: true }
      );
    }

    // Update Student (excluding userId & addressId)
    const studentUpdateFields = { ...req.body };
    delete studentUpdateFields.user;
    delete studentUpdateFields.address;

    student = await Student.findByIdAndUpdate(
      req.params.id,
      { $set: studentUpdateFields },
      { new: true, session }
    )
      .populate("userId") // Populate updated user details
      .populate("addressId"); // Populate updated address

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ message: "Student updated succesfully", data: student });
  } catch (error) {
    // Abort the transaction on error
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: error.message });
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
  try {
    const { id } = req.params;

    // 1. Validate ID format (400 Bad Request if invalid)
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid student ID" });
    }

    // 2. Find the student first (to ensure it exists)
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // 3. Use deleteOne to trigger the middleware
    await student.deleteOne(); // This triggers the post('deleteOne') hook

    // 3. Success response
    res.status(200).json({ message: "Student and linked data deleted" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
};
