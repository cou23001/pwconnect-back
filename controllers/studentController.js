// controllers/studentController.js
const Student = require("../models/student");
const User = require("../models/user");
const Address = require("../models/address");
const mongoose = require("mongoose");
const UserRole = require("../models/userRole");

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
 *                   example: "Students retrieved"
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
 *                               example:
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
    const students = await Student.find().populate("user").populate("address");
    if (students.length === 0) {
      return res.status(404).json({ message: "No students found" });
    }
    res.status(200).json({ message: "Success", data: students });
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
 *          description: A list of students
 *          content:
 *            application/json:
 *              schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Students retrieved successfully"
 *                 data:
 *                   type: object
 *                   description: List of students with user and address information
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
 *        500:
 *          description: Internal server error
 */
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
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
 *     tags: [Student]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: The student's first name.
 *               lastName:
 *                 type: string
 *                 description: The student's last name.
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The student's email address.
 *               password:
 *                 type: string
 *                 format: password
 *                 description: The student's password.
 *               role:
 *                 type: string
 *                 description: The student's role (default is "student").
 *                 default: "student"
 *               street:
 *                 type: string
 *                 description: The street address of the student.
 *               neighborhood:
 *                 type: string
 *                 description: The neighborhood or apartment of the student.
 *               city:
 *                 type: string
 *                 description: The city of the student.
 *               state:
 *                 type: string
 *                 description: The state of the student.
 *               country:
 *                 type: string
 *                 description: The country of the student.
 *               postalCode:
 *                 type: string
 *                 description: The postal code of the student.
 *               birthDate:
 *                 type: string
 *                 format: date
 *                 description: The date of birth of the student.
 *               phone:
 *                 type: string
 *                 description: The phone number of the student.
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *               - street
 *               - city
 *               - state
 *               - country
 *               - postalCode
 *               - birthDate
 *               - phone
 *               - language
 *               - level
 *             example:
 *               firstName: "John"
 *               lastName: "Doe"
 *               email: "john.doe@example.com"
 *               password: "password123"
 *               role: "student"
 *               street: "123 Main St."
 *               neighborhood: "Apt. 101"
 *               city: "Salt Lake City"
 *               state: "UT"
 *               country: "USA"
 *               postalCode: "84101"
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
 *                     userId:
 *                       type: string
 *                       description: The ID of the user associated with the student.
 *                       example: "67def8dc21d7683620e7b62c"
 *                     addressId:
 *                       type: string
 *                       description: The ID of the address associated with the student.
 *                       example: "67def8dc21d7683620e7b62f"
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
    // Get user and address information from body
    const {
      firstName,
      lastName,
      email,
      password,
      street,
      neighborhood,
      city,
      state,
      country,
      postalCode,
      birthDate,
      phone,
      language,
      level,
    } = req.body;

    // Check fields are present
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !street ||
      !city ||
      !state ||
      !country ||
      !postalCode ||
      !birthDate ||
      !phone ||
      !language ||
      !level
    ) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    // Check if the user already exists
    const existing = await User.findOne({ email }).session(session);
    if (existing) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "User already exists" });
    }

    // Fetch the role
    const roleName = "student";
    const userRole = await UserRole.findOne({ name: roleName });

    // Create the user and address objects
    const user = new User({
      _id: new mongoose.Types.ObjectId(),
      firstName,
      lastName,
      email,
      password,
      role: userRole._id,
    });
    await user.save({ session });

    const address = new Address({
      _id: new mongoose.Types.ObjectId(),
      street,
      neighborhood,
      city,
      state,
      country,
      postalCode,
    });
    await address.save({ session });

    const student = new Student({
      _id: new mongoose.Types.ObjectId(),
      userId: user._id,
      addressId: address._id,
      birthDate,
      phone,
      language,
      level,
    });

    await student.save({ session });
    await session.commitTransaction();
    session.endSession();
    res.status(200).json({ message: "Student created succesfully", data: student });
  } catch (error) {
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
 *         description: Student updated
 *         content:
 *            application/json:
 *              schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Students retrieved successfully"
 *                 data:
 *                   type: object
 *                   description: List of students with user and address information
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
 *       500:
 *         description: Internal server error
 */
const updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({ message: "Student updated", data: student });
  } catch (error) {
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
 *       500:
 *         description: Internal server error
 */
const deleteStudent = async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Student deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
};
