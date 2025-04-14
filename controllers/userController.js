const User = require('../models/user');
const TokenMetadata = require('../models/tokenMetadata');
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
    const user = await User.findById(req.params.id).select('-hashedPassword').populate({
      path: 'wardId',
      populate: {
        path: 'stakeId'  // This populates the stake within the ward
      }
    });
    
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
 * /api/users/wards/{wardId}:
 *   get:
 *     summary: Get users by ward ID
 *     description: Retrieve all users associated with a specific ward ID.
 *     tags: [Users, Wards]
 *     parameters:
 *       - in: path
 *         name: wardId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the ward to retrieve users from
 *     responses:
 *       200:
 *         description: List of users in the specified ward
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Users found for this ward
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid ward ID format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid ward ID format
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal Server Error
 */

const getUsersByWardId = async (req, res) => {
  try {
    const { wardId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(wardId)) {
      return res.status(400).send({ error: 'Invalid ward ID format' });
    }

    const users = await User.find({ wardId: wardId }).select('-hashedPassword');

    res.status(200).json({ message: 'Users found for this ward', users });
  } catch (error) {
    console.error("Error fetching users by ward:", error);
    res.status(500).json({ error: error.message });
  }
};


/**
 * @swagger
 * /api/instructors/wards/{wardId}:
 *   get:
 *     summary: Get instructors by ward ID
 *     description: Retrieve all instructors (users with type 11) associated with a specific ward ID.
 *     tags: [Instructors, Wards]
 *     parameters:
 *       - in: path
 *         name: wardId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the ward to retrieve instructors from
 *     responses:
 *       200:
 *         description: List of instructors in the specified ward
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Instructors found for this ward
 *                 instructors:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid ward ID format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid ward ID format
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal Server Error
 */

const getInstructorsByWardId = async (req, res) => {
  try {
    const { wardId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(wardId)) {
      return res.status(400).send({ error: 'Invalid ward ID format' });
    }

    const instructors = await User.find({ wardId: wardId, type: 11 }).select('-hashedPassword');

    res.status(200).json({ message: 'Instructors found for this ward', instructors });
  } catch (error) {
    console.error("Error fetching instructors by ward:", error);
    res.status(500).json({ error: error.message });
  }
};

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
 *               wardId:
 *                 type: string
 *                 description: The ID of the ward associated with the user.
 *                 example: 507f1f77bcf86cd799439011
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

    // Find the user by ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
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
      req.body = req.body || {};
      req.body.avatar = newAvatarUrl;
    }

    // Validate the request body
    const { error, value } = partialUserSchema.validate(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    const { firstName, lastName, email, newPassword, currentPassword, wardId, type, avatar, phone } = value;

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
    if (wardId) user.wardId = wardId;
    if (type) user.type = type;
    if (phone) user.phone = phone;
    if (avatar) user.avatar = avatar;

    // Save the updated user
    const updatedUser = await user.save();

    const result = await User.findById(id).populate({
      path: 'wardId',
      populate: {
        path: 'stakeId'  // This populates the stake within the ward
      }
    });

    // 8. Cleanup old avatar AFTER successful commit
    if (oldAvatarUrl && oldAvatarUrl !== DEFAULT_AVATAR_URL) {
      try {
        await deleteFromS3(oldAvatarUrl);
      } catch (err) {
        console.error("Error deleting old avatar (non-critical):", err);
      }
    }

    res.status(200).json({ message: 'User updated successfully', data: result });
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
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;

    // Validate the user ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    // Find and delete the user
    const user = await User.findByIdAndDelete(id, { session });
    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete associated token metadata
    const tkMetaData = await TokenMetadata.deleteMany({ userId: id }).session(session);
    if (!tkMetaData) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ error: 'Token metadata not found' });
    }

    // Delete from S3 if avatar is custom
    const avatarUrl = user.avatar;
    const isCustomS3Avatar =
      avatarUrl &&
      avatarUrl.startsWith("https://") &&
      avatarUrl.includes("s3.amazonaws.com") &&
      !avatarUrl.includes("avatar/default");

    if (isCustomS3Avatar) {
      try {
        await deleteFromS3(avatarUrl);
      } catch (s3Error) {
        console.error(`Failed to delete avatar for user ${user._id}:`, s3Error);
        // Non-critical failure: don't rollback DB, just log it
      }
    }

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ message: 'User deleted successfully', data: user });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


module.exports = { getUsers, getUserById, deleteUser, updateUser, getUsersByWardId, getInstructorsByWardId };