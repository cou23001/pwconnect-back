// controllers/addressController.js
const Address = require("../models/address");
const User = require("../models/user");
const mongoose = require("mongoose");

/**
 * @swagger
 * tags:
 *   name: Address
 *   description: Address management
 */

/**
 * @swagger
 * /api/address:
 *   get:
 *     summary: Get all addresses
 *     tags: [Address]
 *     responses:
 *       200:
 *         description: A list of addresses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Address'
 *       500:
 *         description: Internal server error
 */
const getAllAddresses = async (req, res) => {
  try {
    const addresses = await Address.find();
    res.status(200).json({ message: "Success", data: addresses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @swagger
 * /api/address/{id}:
 *    get:
 *      summary: Get an address by ID
 *      description: Retrieve an address by ID
 *      tags: [Address]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: Address ID
 *      responses:
 *        200:
 *          description: A list of addresses
 *          content:
 *            application/json:
 *              schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Address found"
 *                 data:
 *                     type: object
 *                     $ref: '#/components/schemas/Address'
 *        404:
 *          description: Address not found
 *        500:
 *          description: Internal server error
 */
const getAddressById = async (req, res) => {
  try {
    const address = await Address.findById(req.params.id);
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }
    res.status(200).json({ message: "Success", data: address });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @swagger
 * /api/address:
 *   post:
 *     summary: Create a new address
 *     tags: [Address]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Address'
 *     responses:
 *       201:
 *         description: The address was succesfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Address'
 *       400:
 *         description: Bad request (e.g., invalid input).
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
 *     security:
 *       - BearerAuth: []
 */
const createAddress = async (req, res) => {
  try {
    const address = new Address(req.body);
    await address.save();
    res.status(200).json({ message: "Success", data: address });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @swagger
 * /api/address/{id}:
 *   put:
 *     summary: Update an address by ID
 *     tags: [Address]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the address
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/Address'
 *     responses:
 *       200:
 *         description: The address was succesfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Instructor updated successfully"
 *                 data:
 *                   type: object
 *                   $ref: '#/components/schemas/Address'
 *       400:
 *         description: Bad request (e.g., invalid input).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "At least one field must be updated"
 *       404:
 *         description: Address not found
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
 *     security:
 *       - BearerAuth: []
 */
const updateAddress = async (req, res) => {
  try {
    const address = await Address.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({ message: "Success", data: address });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @swagger
 * /api/address/{id}:
 *   delete:
 *     summary: Delete an address by ID
 *     tags: [Address]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the address
 *     responses:
 *       200:
 *         description: The address was succesfully deleted
 *       404:
 *         description: Address not found
 *       500:
 *         description: Internal server error
 */
const deleteAddress = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id)) {
          return res.status(400).json({ message: "Invalid address ID" });
    }
    const address = await Address.findByIdAndDelete(id);
    res.status(200).json({ message: "Success", data: address });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllAddresses,
  getAddressById,
  createAddress,
  updateAddress,
  deleteAddress,
};
