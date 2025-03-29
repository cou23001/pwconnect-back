// controllers/registrationController.js

const Registration = require('../models/registration');
const Student = require('../models/student');
const Ward = require('../models/ward');
const Group = require('../models/group');


/**
 * @swagger
 * tags:
 *   name: Registration
 *   description: Registration management
 */

/**
 * @swagger
 * api/registrations:
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
 */

// Get all registrations
exports.getRegistrations = async (req, res) => {
    try {
        const registrations = await Registration.find();
        if (registrations.length === 0) {
            return res.status(404).json({ message: 'No registrations found' });
        }
        res.status(200).json(registrations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @swagger
 * api/registrations/{id}:
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
 */

// Get a registration by ID
exports.getRegistrationById = async (req, res) => {
    try {
        const registration = await Registration.findById(req.params.id);
        if (!registration) {
            return res.status(404).json({ message: 'Registration not found' });
        }
        res.status(200).json(registration);
    } catch (error) {
        res.status(500).json({ message: error.message });
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
 *       404:
 *         description: No registrations found for this group
 *       500:
 *         description: Internal server error
 */

exports.getStudentsByGroupId = async (req, res) => {
    try {
      const groupId = req.params.groupId;
  
      const registrations = await Registration.find({ groupId: groupId })
      .populate({
        path: 'studentId',
        populate: { path: 'userId' },
      });
  
      if (!registrations || registrations.length === 0) {
        return res.status(404).json({ message: 'No registrations found for this group' });
      }
  
      const students = registrations.map(registration => registration.studentId);
  
      res.status(200).json(students);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

/**
 * @swagger
 * api/registrations:
 *  post:
 *   summary: Create a new registration
 *   tags: [Registration]
 *   requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           $ref: '#/components/schemas/Registration'
 *   responses:
 *     201:
 *       description: A registration created
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Registration'
 *     500:
 *       description: An error occurred
 */

// Create a new registration
exports.createRegistration = async (req, res) => {
    try {
        const student = await Student.findById(req.body.studentId);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const group = await Group.findById(req.body.groupId);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        const registration = new Registration({
            studentId: req.body.studentId,
            groupId: req.body.groupId,
            date: req.body.date,
            notes: req.body.notes,
        });

        const savedRegistration = await registration.save();
        res.status(201).json(savedRegistration);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @swagger
 * api/registrations/{id}:
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
 *           $ref: '#/components/schemas/Registration'
 *   responses:
 *     200:
 *       description: The registration updated
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Registration'
 *     404:
 *       description: The registration was not found
 *     500:
 *       description: An error occurred
 */

// Update a registration
exports.updateRegistration = async (req, res) => {
    try {
        const registration = await Registration.findById(req.params.id);
        if (!registration) {
            return res.status(404).json({ message: 'Registration not found' });
        }

        const student = await Student.findById(req.body.studentId);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const group = await Group.findById(req.body.groupId);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        registration.studentId = req.body.studentId;
        registration.groupId = req.body.groupId;
        registration.date = req.body.date;
        registration.notes = req.body.notes;

        const updatedRegistration = await registration.save();
        res.status(200).json(updatedRegistration);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @swagger
 * api/registrations/{id}:
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
 *     404:
 *       description: The registration was not found
 *     500:
 *       description: An error occurred
 */

// Delete a registration
exports.deleteRegistration = async (req, res) => {
    try {
        const registration = await Registration.findById(req.params.id);
        if (!registration) {
            return res.status(404).json({ message: 'Registration not found' });
        }

        await registration.remove();
        res.status(200).json({ message: 'Registration deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = exports;