// controllers/studentController.js
const Student = require('../models/student');
const User = require('../models/user');
const Address = require('../models/address');
const mongoose = require('mongoose');

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
    const students = await Student.find();
    res.status(200).json({ message: 'Success', data: students });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

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
    res.status(200).json({ message: 'Success', data: student });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

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
 *             $ref: '#/components/schemas/Student'
 *     responses:
 *       200:
 *         description: Student created
 *       500:
 *         description: Internal server error
 */
const createStudent = async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const address = await Address.findById(req.body.addressId);
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    const student = new Student({
      _id: new mongoose.Types.ObjectId(),
      userId: req.body.userId,
      addressId: req.body.addressId,
      birthDate: req.body.birthDate,
      phone: req.body.phone,
      level: req.body.level,
      language: req.body.language,
    });

    await student.save();
    res.status(200).json({ message: 'Student created', data: student });
  }
  catch (error) {
    res.status(500).json({ message: error.message });
  }
}

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
 *                          description: Updated first name of the instructor
 *                      lastName:
 *                          type: string
 *                          description: Updated last name of the instructor
 *                      email:
 *                          type: string
 *                          format: email
 *                          description: Updated email of the instructor
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
    const student = await Student.findByIdAndUpdate(req
      .params.id, req.body, { new: true });
    res.status(200).json({ message: 'Student updated', data: student });
  }
  catch (error) {
    res.status(500).json({ message: error.message });
  }
}

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
    res.status(200).json({ message: 'Student deleted' });
  }
  catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = { getAllStudents, getStudentById, createStudent, updateStudent, deleteStudent };