// controllers/addressController.js
const Address = require("../models/address");
const mongoose = require("mongoose");
const { addressSchema, partialAddressSchema } = require("../validators/address");

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
 *       404:
 *         description: No addresses found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No addresses found"
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
const getAllAddresses = async (req, res) => {
  try {
    const addresses = await Address.find();
    if (addresses.length === 0) {
      return res.status(404).json({ message: "No addresses found" });
    }
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
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: Address not found
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
const getAddressById = async (req, res) => {
  try {
    const { id } = req.params;
    // Validate ID format
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid address ID" });
    }
    
    // Check if address exists
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
 *             type: object
 *             properties:
 *               street:
 *                 type: string
 *                 example: "123 Main St"
 *               neighborhood:
 *                 type: string
 *                 example: "Downtown"
 *               city:
 *                 type: string
 *                 example: "New York"
 *               state:
 *                 type: string
 *                 example: "NY"
 *               country:
 *                 type: string
 *                 example: "USA"
 *               postalCode:
 *                 type: string
 *                 example: "10001"
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
const createAddress = async (req, res) => {
  try {
    // Validate request body
    const { value, error } = addressSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const newAddress = await Address.create(value);
    res.status(200).json({ message: "Success", data: newAddress });
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
 *             properties:
 *               street:
 *                 type: string
 *                 example: "123 Main St"
 *               neighborhood:
 *                 type: string
 *                 example: "Downtown"
 *               city:
 *                 type: string
 *                 example: "New York"
 *               state:
 *                 type: string
 *                 example: "NY"
 *               country:
 *                 type: string
 *                 example: "USA"
 *               postalCode:
 *                 type: string
 *                 example: "10001"
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
const updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    // Validate ID format
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid address ID" });
    }
    // Validate request body
    const { value, error } = partialAddressSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    // Check if address exists
    const address = await Address.findById(id);
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }
    // Update address
    const newAddress = await Address.findByIdAndUpdate(id, value, {
      new: true,
    });
    res.status(200).json({ message: "Success", data: newAddress });
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
