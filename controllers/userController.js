const User = require('../models/user');
const argon2 = require('argon2');
const { partialUserSchema } = require('../validators/user');
const mongoose = require('mongoose');
const { uploadToS3, deleteFromS3 } = require("../utils/upload");
const dotenv = require("dotenv");
dotenv.config();
const DEFAULT_AVATAR_URL = process.env.DEFAULT_AVATAR_URL;

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
 *                 $ref: '#/components/schemas/UserResponse'
 *       404:
 *         description: No users found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No users found
 *       500:
 *         description: Internal Server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
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
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: User not found
 *        500:
 *          description: Internal Server Error
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: Internal Server Error
 */
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-hashedPassword');
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }
    res.status(200).json({ message: 'Success', data: user });
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: Image file to upload as the user's avatar.
 *               firstName:
 *                 type: string
 *                 description: The user's first name.
 *                 example: John
 *               lastName:
 *                 type: string
 *                 description: The user's last name.
 *                 example: Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The user's email address.
 *                 example: john@example.com
 *               type:
 *                 type: number
 *                 description: The user's type (1 = Student, 10 = Admin, 11 = Instructor).
 *                 example: 1
 *               phone:
 *                 type: string
 *                 description: The user's phone number.
 *                 example: 123-456-7890
 *               newPassword:
 *                 type: string
 *                 description: The new password.
 *                 example: newpassword123
 *               currentPassword:
 *                 type: string
 *                 description: The current password (required if updating the password).
 *                 example: oldpassword123
 *     responses:
 *       200:
 *         description: The updated user object (password excluded).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: Bad request (e.g., current password is required but not provided).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Current password is required
 *       401:
 *         description: Unauthorized (e.g., invalid current password).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid current password
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    // Validate the user ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
          return res.status(400).send({ error: 'Invalid ID format' });
    }

    // 2. Handle file upload if present
    let oldAvatarUrl = null;
    if (req.file) {
      // Validate type (redundant check)
      const validTypes = ["image/jpeg", "image/png"];
      if (!validTypes.includes(req.file.mimetype)) {
        return res.status(400).json({ message: "Invalid file type" });
      }
      // Check if the file is too large
      if (req.file.size > 2 * 1024 * 1024) {
        // 2MB limit
        return res.status(400).json({ message: "File size exceeds limit" });
      }
      // Store old avatar URL for cleanup
      oldAvatarUrl = user.avatar;

      // Upload new avatar
      const newAvatarUrl = await uploadToS3(req.file);
      req.body.user = req.body.user || {};
      req.body.user.avatar = newAvatarUrl;
    }

    // Find the user by ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    // Validate the request body
    const { error, value } = partialUserSchema.validate(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    const { firstName, lastName, email, newPassword, currentPassword, type, phone } = value;


    // If the user is trying to update their email, check if it already exists
    if (email && email !== user.email) {
      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(400).send({ message: 'Email already exists' });
      }
    }

    // If the user wants to change the password, verify the current password
    if (newPassword) {
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
      const hashedPassword = await hashPassword(newPassword);
      user.password = hashedPassword;
    }

    // Update other fields
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;
    if (type) user.type = type;
    if (phone) user.phone = phone;

    // Save the updated user
    const updatedUser = await user.save();

    // Exclude the hashedPassword from the response
    const userResponse = updatedUser.toObject();
    delete userResponse.password;

    // 8. Cleanup old avatar AFTER successful commit
    if (oldAvatarUrl && oldAvatarUrl !== DEFAULT_AVATAR_URL) {
      try {
        await deleteFromS3(oldAvatarUrl);
      } catch (err) {
        console.error("Error deleting old avatar (non-critical):", err);
      }
    }

    res.status(200).json({ message: 'User updated successfully', data: userResponse });
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
 *               $ref: '#/components/schemas/UserResponse'
 *        404:
 *          description: User not found
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: User not found
 *        500:
 *          description: Internal Server Error
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: Internal Server Error
 */
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    // Validate the user ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({ error: 'Invalid ID format' });
    }

    // Find the user by ID and delete
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }
    res.json(200).send({ message: 'User deleted successfully', data: user });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
}

module.exports = { getUsers, getUserById, deleteUser, updateUser };