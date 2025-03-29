//controllers/userRoleController.js
const UserRole = require('../models/userRole');
//const UserPermission = require('../models/userPermission');

/**
 * @swagger
 * tags:
 *   name: UserRole
 *   description: User Role management
 */

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
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Roles retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/UserRole'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 */
exports.getRoles = async (req, res) => {
  try {
    const roles = await UserRole.find();
    res.status(200).json({ message: 'Roles retrieved successfully', data: roles });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}

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
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the role
 *                 example: 'Admin'
 *               userPermissions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       format: ObjectId
 *                       description: The unique ID of the user permission
 *                       example: '507f1f77bcf86cd799439011'
 *                     name:
 *                       type: string
 *                       description: The name of the permission
 *                       example: 'create'
 *                     description:
 *                       type: string
 *                       description: The description of the permission
 *                       example: 'Can create records'
 *     responses:
 *       201:
 *         description: Role created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserRole'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: 'Bad request'
 */
exports.createRole = async (req, res) => {
  try {
    const role = new UserRole(req.body);
    await role.save();
    res.status(201).send({ message: 'Role created successfully', data: role });
  } catch (error) {
    res.status(400).send(error);
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
    res.status(200).send({ message: 'Role retrieved successfully', data: role });
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
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the role
 *                 example: 'Admin'
 *               userPermissions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       description: The name of the permission
 *                       example: 'create'
 *                     description:
 *                       type: string
 *                       description: The description of the permission
 *                       example: 'Can create records'
 *     responses:
 *       200:
 *         description: Role updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserRole'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: 'Bad request'
 *       404:
 *         description: Role not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Role not found'
 * 
 */
exports.updateRole = async (req, res) => {
  try {
    console.log(req.body);
    const role = await UserRole.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!role) {
      res.status(404).send('Role not found');
    }
    res.status(200).send( { message: 'Role updated successfully', data: role });
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserRole'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: 'Bad request'
 *       404:
 *         description: Role not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Role not found'
 */
exports.deleteRole = async (req, res) => {
  try {
    const role = await UserRole.findByIdAndDelete(req.params.id);
    if (!role) {
      res.status(404).send('Role not found');
    }
    res.status(200).send({ message: 'Role deleted successfully', data: role });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}