//controllers/userRoleController.js
const UserRole = require('../models/UserRole');
const UserPermission = require('../models/userPermission');

/**
 * @swagger
 * tags:
 *   name: UserRole
 *   description: User Role management
 */

// Create a new role
/**
 * @swagger
 * /api/roles:
 *   post:
 *     summary: Create a new role
 *     tags: [UserRole]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRole'
 *     responses:
 *       201:
 *         description: Role created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserRole'
 *       400:
 */
exports.createRole = async (req, res) => {
  try {
    const role = new UserRole(req.body);
    await role.save();
    res.status(201).send(role);
  } catch (error) {
    res.status(400).send(error);
  }
}

// Get all roles
/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * /api/roles:
 *   get:
 *     summary: Retrieve a list of roles
 *     tags: [UserRole]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of roles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserRole'
 */
exports.getRoles = async (req, res) => {
  try {
    //const roles = await UserRole.find();
    const roles = await UserRole.find().populate('userPermissions', 'name -_id');
    res.json(roles);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}

// Get a role by ID
/**
 * @swagger
 * /api/roles/{id}:
 *   get:
 *     summary: Get a role by ID
 *     tags: [UserRole]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Role ID
 *     responses:
 *       200:
 *         description: Role retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserRole'
 *       404:
 *         description: Role not found
 */
exports.getRole = async (req, res) => {
  try {
    const role = await UserRole.findById(req.params.id);
    if (!role) {
      res.status(404).send('Role not found');
    }
    res.json(role);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}

// Update a role by ID
/**
 * @swagger
 * /api/roles/{id}:
 *   put:
 *     summary: Update a role by ID
 *     tags: [UserRole]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Role ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRole'
 *     responses:
 *       200:
 *         description: Role updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserRole'
 *       404:
 *         description: Role not found
 */
exports.updateRole = async (req, res) => {
  try {
    const role = await UserRole.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!role) {
      res.status(404).send('Role not found');
    }
    res.json(role);
  }
  catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}

// Delete a role by ID
/**
 * @swagger
 * /api/roles/{id}:
 *   delete:
 *     summary: Delete a role by ID
 *     tags: [UserRole]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Role ID
 *     responses:
 *       200:
 *         description: Role deleted successfully
 *       404:
 *         description: Role not found
 */
exports.deleteRole = async (req, res) => {
  try {
    const role = await UserRole.findByIdAndDelete(req.params.id);
    if (!role) {
      res.status(404).send('Role not found');
    }
    res.json(role);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}