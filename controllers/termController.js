// controllers/termController.js
const Term = require('../models/term');

/**
 * @swagger
 * tags:
 *   name: Terms
 *   description: Term management
 */

/**
 * @swagger
 * /api/terms:
 *   get:
 *     summary: Get a list of terms
 *     tags: [Terms]
 *     responses:
 *       200:
 *         description: A list of terms
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Term'
 */
const getTerms = async (req, res) => {
  try {
    const terms = await Term.find();
    if (terms.length === 0) {
      return res.status(404).send('Terms not found');
    }
    res.json(terms);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}

/**
 * @swagger
 * /api/terms:
 *   post:
 *     summary: Create a new term
 *     tags: [Terms]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Term'
 *     responses:
 *       201:
 *         description: The term was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Term'
 *       400:
 *         description: Bad request
 */
const createTerm = async (req, res) => {
  try {
    // Validate request
    if (!req.body.name || !req.body.startDate || !req.body.endDate) {
      return res.status(400).send('Missing required fields: name, startDate, and endDate');
    }
    const term = new Term(req.body);
    await term.save();
    res.status(201).json(term);
  } catch (error) {
    console.error(error);
    res.status(400).send('Bad request');
  }
}

/**
 * @swagger
 * /api/terms/{id}:
 *   get:
 *     summary: Get a term by ID
 *     tags: [Terms]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The term ID
 *     responses:
 *       200:
 *         description: The term
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Term'
 *       404:
 *         description: Term not found
 */
const getTermById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const term = await Term.findById(id);
    if (!term) {
      return res.status(404).send('Term not found');
    }
    res.json(term);
  }
  catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}

/**
 * @swagger
 * /api/terms/{id}:
 *   put:
 *     summary: Update a term
 *     tags: [Terms]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The term ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Term'
 *     responses:
 *       200:
 *         description: The term was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Term'
 *       400:
 *         description: Bad request
 */
const updateTerm = async (req, res) => {
  try {
    const { id } = req.params;
    const term = await Term.findByIdAndUpdate
      (id,
        req.body,
        { new: true });
    if (!term) {
      return res.status(404).send('Term not found');
    }
    res.json(term);
  }
  catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}

/**
 * @swagger
 * /api/terms/{id}:
 *   delete:
 *     summary: Delete a term
 *     tags: [Terms]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The term ID
 *     responses:
 *       200:
 *         description: The term was deleted
 *       404:
 *         description: Term not found
 */
const deleteTerm = async (req, res) => {
  try {
    const { id } = req.params;
    const term = await Term.findByIdAndDelete(id);
    if (!term) {
      return res.status(404).send('Term not found');
    }
    res.json(term);
  }
  catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}

module.exports = {
  getTerms,
  createTerm,
  getTermById,
  updateTerm,
  deleteTerm
};