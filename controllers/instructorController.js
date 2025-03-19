// controllers/instructorController.js
const Instructor = require('../models/instructor');

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
 *     summary: Get a list of instructors
 *     tags: [Instructors]
 *     responses:
 *       200:
 *         description: A list of instructors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Instructor'
 */
const getInstructors = async (req, res) => {
  try {
    const instructors = await Instructor.find();
    res.json(instructors);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}

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
 *             $ref: '#/components/schemas/Instructor'
 *     responses:
 *       201:
 *         description: The instructor was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Instructor'
 *       400:
 *         description: Bad request
 */
const createInstructor = async (req, res) => {
  try {
    const instructor = new Instructor(req.body);
    await instructor.save();
    res.status(201).json(instructor);
  } catch (error) {
    console.error(error);
    res.status(400).send('Bad request');
  }
}

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
 *         required: true
 *         description: The instructor ID
 *     responses:
 *       200:
 *         description: An instructor object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Instructor'
 *       404:
 *         description: The instructor was not found
 */
const getInstructorById = async (req, res) => {
  try {
    const instructor = await Instructor.findById(req.params.id);
    if (!instructor) {
      res.status(404).send('The instructor was not found');
    }
    res.json(instructor);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}

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
 *             $ref: '#/components/schemas/Instructor'
 *     responses:
 *       200:
 *         description: The instructor was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Instructor'
 *       404:
 *         description: The instructor was not found
 */
const updateInstructor = async (req, res) => {
  try {
    const instructor = await Instructor.findByIdAndUpdate
      (req
        .params
        .id, req.body, {new: true});
    if (!instructor) {
      res.status(404).send('The instructor was not found');
    }
    res.json(instructor);
  }
  catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}

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
      res.status(404).send('The instructor was not found');
    }
    res.json(instructor);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}

module.exports = {
  getInstructors,
  createInstructor,
  getInstructorById,
  updateInstructor,
  deleteInstructor
};