//controllers/permissionController.js
const UserRole = require('../models/userRole');
const UserPermission = require('../models/userPermission');

/**
 * @swagger
 * tags:
 *   name: UserPermission
 *   description: User Permission management
 */

// Create a new permission
/**
 * @swagger
 * /api/permissions:
 *   post:
 *     summary: Create a new permission
 *     tags: [UserPermission]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserPermission'
 *     responses:
 *       201:
 *         description: Permission created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserPermission'
 *       400:
 */
exports.createPermission = async (req, res) => {
  try {
    const permission = new UserPermission(req.body);
    await permission.save();
    res.status(201).send(permission);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Get all permissions
/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * /api/permissions:
 *   get:
 *     summary: Retrieve a list of permissions
 *     tags: [UserPermission]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of permissions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserPermission'
 */
exports.getPermissions = async (req, res) => {
  try {
    const permissions = await UserPermission.find();
    res.status(200).send(permissions);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Get a permission by ID
/**
 * @swagger
 * /api/permissions/{id}:
 *   get:
 *     summary: Get a permission by ID
 *     tags: [UserPermission]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the permission
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Permission retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserPermission'
 *       404:
 *         description: Permission not found
 *       500:
 */
exports.getPermissionById = async (req, res) => {
  try {
    const permission = await UserPermission.findById(req.params.id);
    if (!permission) {
      return res.status(404).send('Permission not found');
    }
    res.status(200).send(permission);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Update a permission by ID
/**
 * @swagger
 * /api/permissions/{id}:
 *   put:
 *     summary: Update a permission by ID
 *     tags: [UserPermission]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the permission
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserPermission'
 *     responses:
 *       200:
 *         description: Permission updated successfully
 *       400:
 */
exports.updatePermission = async (req, res) => {
  try {
    await UserPermission.findByIdAndUpdate
      (req
      .params
      .id,
      req.body,
      { new: true, runValidators: true },
    );
    res.status(200).send('User Permission updated successfully');
  }
  catch (error) {
    res.status(400
    ).send
    (error);
  }
}

// Delete a permission by ID
/**
 * @swagger
 * /api/permissions/{id}:
 *   delete:
 *     summary: Delete a permission by ID
 *     tags: [UserPermission]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the permission
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Permission deleted successfully
 *       404:
 *         description: Permission not found
 *       500:
 */
exports.deletePermission = async (req, res) => {
  try {
    const permission = await UserPermission.findByIdAndDelete(req.params.id);
    if (!permission) {
      return res.status(404).send('Permission not found');
    }
    res.status(200).send('User Permission deleted successfully');
  } catch (error) {
    res.status(500).send(error);
  }
};