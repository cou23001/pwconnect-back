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
 *       404:
 *         description: No users found
 *       500:
 *         description: Internal Server
 */
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-hashedPassword');
    if (users.length === 0) {
      return res.status(404).send({ message: 'No users found' });
    } 
    res.status(200).json({ message: 'Success', data: users });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal Server Error' });
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
 *               - firstName
 *               - email
 *               - password
 *             properties:
 *               firstName:
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
    const { firstName, lastName, email, password } = req.body;
    const hashedPassword = await hashPassword(password);
    const user = new User({ firstName, lastName, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User created successfully', data: user });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal Server Error' });
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
      return res.status(404).send({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
}

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update a user by ID
 *     description: Update a user's details. To change the password, the current password must be provided.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: The user's first name.
 *               lastName:
 *                 type: string
 *                 description: The user's last name.
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The user's email address.
 *               password:
 *                 type: string
 *                 description: The new password.
 *               currentPassword:
 *                 type: string
 *                 description: The current password (required if updating the password).
 *     responses:
 *       200:
 *         description: The updated user object (password excluded).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: Bad request (e.g., current password is required but not provided).
 *       401:
 *         description: Unauthorized (e.g., invalid current password).
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal Server Error.
 */
const updateUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, currentPassword } = req.body;
    const userId = req.params.id;

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    // If the user wants to change the password, verify the current password
    if (password) {
      if (!currentPassword) {
        return res.status(400).send({ message: 'Current password is required' });
      }

      // Compare the provided current password with the stored hashed password
      const isPasswordValid = await comparePassword(currentPassword, user.password);
      //const isPasswordValid = await bcrypt.compare(currentPassword, user.hashedPassword);
      if (!isPasswordValid) {
        return res.status(401).send({ message: 'Invalid current password' });
      }

      // Hash the new password
      const hashedPassword = await hashPassword(password);
      user.password = hashedPassword;
    }

    // Update other fields
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;

    // Save the updated user
    const updatedUser = await user.save();

    // Exclude the hashedPassword from the response
    const userResponse = updatedUser.toObject();
    delete userResponse.password;

    res.json({ message: 'User updated successfully', data: userResponse });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal Server Error' });
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
      return res.status(404).send({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
}

module.exports = { getUsers, createUser, getUserById, deleteUser, updateUser };