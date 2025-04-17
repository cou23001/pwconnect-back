// controllers/registrationController.js

const Registration = require("../models/registration");
const Student = require("../models/student");
const Group = require("../models/group");
const mongoose = require("mongoose");
const {
  registrationSchema,
  registrationUpdateSchema,
  idValidationSchema,
} = require("../validators/registration");

/**
 * @swagger
 * tags:
 *   name: Registration
 *   description: Registration management
 */

/**
 * @swagger
 * /api/registrations:
 *  get:
 *   summary: Retrieve a list of registrations
 *   tags: [Registration]
 *   responses:
 *     200:
 *       description: A list of registrations
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/Registration'
 *     404:
 *       description: No registrations found
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: No registrations found
 *     500:
 *       description: An error occurred
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: An error occurred
 */
// Get all registrations
exports.getRegistrations = async (req, res) => {
  try {
    // Find all registrations
    const registrations = await Registration.find();

    // Check if any registrations were found
    if (registrations.length === 0) {
      return res.status(404).json({ message: "No registrations found" });
    }

    // Populate the student and group fields
    res.status(200).json(registrations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @swagger
 * /api/registrations/{id}:
 *  get:
 *   summary: Retrieve a registration by ID
 *   tags: [Registration]
 *   parameters:
 *     - in: path
 *       name: id
 *       schema:
 *         type: string
 *       required: true
 *       description: ID of the registration
 *   responses:
 *     200:
 *       description: A registration
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Registration'
 *     404:
 *       description: The registration was not found
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: Registration not found
 *     500:
 *       description: An error occurred
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: An error occurred
 */

// Get a registration by ID
exports.getRegistrationById = async (req, res) => {
  try {
    const { id } = req.params;
    // Validate ID format
    const isValidId = mongoose.Types.ObjectId.isValid(id);
    if (!isValidId) {
      return res.status(400).send({ error: "Invalid ID format" });
    }

    // Find the registration by ID
    const registration = await Registration.findById(id);
    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }
    res.status(200).json({ message: "Registration found", registration });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @swagger
 * /api/registrations/group/{groupId}/students:
 *   get:
 *     summary: Get all students registered in a group
 *     tags:
 *       - Registration
 *     parameters:
 *       - in: path
 *         name: groupId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the group to retrieve students for
 *     responses:
 *       200:
 *         description: List of students registered in the group
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Student' # Assuming you have a Student schema
 *       400:
 *         description: Invalid group ID format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid ID format
 *       404:
 *         description: No registrations found for this group
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No registrations found for this group
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An error occurred
 */
exports.getStudentsByGroupId = async (req, res) => {
  try {
    const groupId = req.params.groupId;

    // Validate ID format
    const isValidId = mongoose.Types.ObjectId.isValid(groupId);
    if (!isValidId) {
      return res.status(400).send({ error: "Invalid ID format" });
    }

    // Find all registrations for the specified group
    const registrations = await Registration.find({
      groupId: groupId,
    }).populate({
      path: "studentId",
      populate: { path: "userId" },
    });

    if (!registrations || registrations.length === 0) {
      return res
        .status(404)
        .json({ message: "No registrations found for this group" });
    }

    // Extract student IDs from the registrations
    const students = registrations.map(
      (registration) => registration.studentId
    );

    res.status(200).json({ message: "Students found", students });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @swagger
 * /api/registrations:
 *  post:
 *   summary: Create a new registration
 *   tags: [Registration]
 *   requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *             studentId:
 *               type: string
 *               example: 60d5f484f1c2b8b8a4e4e4e4
 *             groupId:
 *               type: string
 *               example: 60d5f484f1c2b8b8a4e4e4e5
 *             date:
 *               type: string
 *               format: date
 *               example: 2023-10-01
 *             notes:
 *               type: string
 *               example: Student registered for the group
 *   responses:
 *     201:
 *       description: A registration created
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: Registration created
 *               registration:
 *                 type: object
 *                 properties:
 *                   studentId:
 *                      $ref: "#/components/schemas/Student"
 *                   groupId:
 *                      $ref: "#/components/schemas/Group"
 *                   date:
 *                     type: string
 *                     format: date
 *                     example: 2023-10-01
 *                   notes:
 *                     type: string
 *                     example: Student registered for the group
 *     400:
 *       description: Invalid ID format
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               error:
 *                 type: string
 *                 example: Invalid ID format
 *     404:
 *       description: Student or group not found
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: Student or group not found
 *     500:
 *       description: An error occurred
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: An error occurred
 */
exports.createRegistration = async (req, res) => {
  try {
    // Validate request body
    const { value, error } = registrationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Find the student and group by ID
    const student = await Student.findById(value.studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const group = await Group.findById(value.groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Check if the student is already registered in the group
    const existingRegistration = await Registration.findOne({
      studentId: value.studentId,
      groupId: value.groupId,
    });
    if (existingRegistration) {
      return res.status(400).json({
        message: "Student is already registered in this group",
      });
    }

    // Create a new registration
    const registration = await Registration.create({
      studentId: value.studentId,
      groupId: value.groupId,
      date: value.date,
      notes: value.notes,
    });
    if (!registration) {
      return res.status(400).json({ message: "Registration failed" });
    }

    // Populate the student and group fields
    await registration.populate("studentId");
    await registration.populate("groupId");

    // Send the registration object as the response
    res.status(201).json({ message: "Registration created", registration });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @swagger
 * /api/registrations/{id}:
 *  put:
 *   summary: Update a registration
 *   tags: [Registration]
 *   parameters:
 *     - in: path
 *       name: id
 *       schema:
 *         type: string
 *       required: true
 *       description: ID of the registration
 *   requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *             studentId:
 *               type: string
 *               example: 60d5f484f1c2b8b8a4e4e4e4
 *             groupId:
 *               type: string
 *               example: 60d5f484f1c2b8b8a4e4e4e5
 *             date:
 *               type: string
 *               format: date
 *               example: 2023-10-01
 *             notes:
 *               type: string
 *               example: Student registered for the group
 *   responses:
 *     200:
 *       description: The registration updated
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: Registration created
 *               registration:
 *                 type: object
 *                 properties:
 *                   studentId:
 *                      $ref: "#/components/schemas/Student"
 *                   groupId:
 *                      $ref: "#/components/schemas/Group"
 *                   date:
 *                     type: string
 *                     format: date
 *                     example: 2023-10-01
 *                   notes:
 *                     type: string
 *                     example: Student registered for the group
 *     400:
 *       description: Invalid ID format
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               error:
 *                 type: string
 *                 example: Invalid ID format
 *     404:
 *       description: The registration was not found
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: Registration not found
 *     500:
 *       description: An error occurred
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: An error occurred
 */
exports.updateRegistration = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID format
    const isValidId = mongoose.Types.ObjectId.isValid(id);
    if (!isValidId) {
      return res.status(400).send({ error: "Invalid registration ID format" });
    }

    // Validate request body
    const { value, error } = registrationUpdateSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { studentId, groupId, date, notes } = value;

    // Find the registration by ID
    const registration = await Registration.findById(id);
    if (!registration) {
      return res.status(404).json({ error: "Registration not found" });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    registration.studentId = studentId;
    registration.groupId = groupId;
    registration.date = date;
    registration.notes = notes;

    const updatedRegistration = await registration.save();

    // Populate the student and group fields
    await updatedRegistration.populate("studentId");
    await updatedRegistration.populate("groupId");

    res.status(200).json({
      message: "Registration updated",
      registration: updatedRegistration,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @swagger
 * /api/registrations/{id}:
 *  delete:
 *   summary: Delete a registration
 *   tags: [Registration]
 *   parameters:
 *     - in: path
 *       name: id
 *       schema:
 *         type: string
 *       required: true
 *       description: ID of the registration
 *   responses:
 *     200:
 *       description: The registration deleted
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: Registration deleted
 *               registration:
 *                 type: object
 *                 properties:
 *                   studentId:
 *                      $ref: "#/components/schemas/Student"
 *                   groupId:
 *                      $ref: "#/components/schemas/Group"
 *                   date:
 *                     type: string
 *                     format: date
 *                     example: 2023-10-01
 *                   notes:
 *                     type: string
 *                     example: Student registered for the group
 *     400:
 *       description: Invalid ID format
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               error:
 *                 type: string
 *                 example: Invalid ID format
 *     404:
 *       description: The registration was not found
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: Registration not found
 *     500:
 *       description: An error occurred
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: An error occurred
 */

// Delete a registration
exports.deleteRegistration = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID format
    const { error, value } = idValidationSchema.validate(id);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const registration = await Registration.findByIdAndDelete(value).populate([
      "studentId",
      "groupId",
    ]);

    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }

    res.status(200).json({ message: "Registration deleted", registration });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = exports;
