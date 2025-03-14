const User = require('../models/user');
const argon2 = require('argon2');

// Hash a password
const hashPassword = async (password) => {
  const hash = await argon2.hash(password);
  return hash;
};

// Compare a password with its hash
const comparePassword = async (password, hash) => {
  const match = await argon2.verify(hash, password);
  return match;
};

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get a list of users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-hashedPassword');
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 description: The user's name
 *               lastName:
 *                 type: string
 *                 description: The user's last name
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The user's email address
 *               password:
 *                 type: string
 *                 format: password
 *                 description: The user's password
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal Server Error
 */
const createUser = async (req, res) => {
  try {
    const { name, lastName, email, password } = req.body;
    const hashedPassword = await hashPassword(password);
    const user = new User({ name, lastName, email, password: hashedPassword });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

/**
 * @swagger
 * /api/users/{id}:
 *    get:
 *      summary: Get a user by ID
 *      description: Retrieve a user by ID
 *      tags: [Users]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: User ID
 *      responses:
 *        200:
 *          description: User found
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/User'
 *        404:
 *          description: User not found
 *        500:
 *          description: Internal Server Error
 */
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-hashedPassword');
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}

/**
 * @swagger
 * /api/users/{id}:
 *    delete:
 *      summary: Delete a user by ID
 *      description: Delete a user by ID
 *      tags: [Users]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: User ID
 *      responses:
 *        200:
 *          description: User deleted
 *          content:
 *            application/json:
 *              schema:
 *               $ref: '#/components/schemas/User'
 *        404:
 *          description: User not found
 *        500:
 *          description: Internal Server Error
 */
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}

module.exports = { getUsers, createUser, getUserById, deleteUser };