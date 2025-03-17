// controllers/authController.js
const User = require('../models/user');
const { generateAccessToken, generateRefreshToken } = require('../config/jwt');
const TokenMetadata = require('../models/tokenMetadata');
const UserRole = require('../models/userRole');

// Register a new user
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication management
 */

/** 
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
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
 *               role:
 *                 type: string
 *                 description: The user's role
 *                 example: student
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: User registered successfully message
 *                 accessToken:
 *                   type: string
 *                   description: Access token
 *                 refreshToken:
 *                   type: string
 *                   description: Refresh token
 *       400:
 *         description: User already exists
 *       500:
 *         description: Internal Server Error
*/
const register = async (req, res) => {
  const session = await User.startSession(); // Start transaction session
  session.startTransaction(); // Start transaction
  try {
    const { firstName, lastName, email, password, role } = req.body;

    // Fetch the role (specific or default)
    const roleName = role || 'student'; // Use the provided role or fall back to 'student'
    const userRole = await UserRole.findOne({ name: roleName });
    if (!userRole) {
      return res.status(400).json({ error: `Role '${roleName}' not found` });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create a new user
    const user = new User({ 
      firstName, 
      lastName, 
      email, 
      password,
      role: userRole._id,
    });
    await user.save({ session });

    // Generate JWT
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Save the refresh token in the database (associated with TokenMetadata)
    const tokenRecord = await TokenMetadata.create(
      [
        {
          userId: user._id,
          refreshToken,
          ipAddress: req.ip,
          userAgent: req.headers['user-agent'],
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        },
      ],
      { session }
    );
    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ message: 'User registered successfully', accessToken, refreshToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Login user
/** 
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The user's email address
 *               password:
 *                 type: string
 *                 format: password
 *                 description: The user's password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Login successful message
 *                 token:
 *                   type: string
 *                   description: JWT token
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
*/
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare passwords
    const isPasswordValid = user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Save the refresh token in the database (associated with the user)
    const token = await TokenMetadata.findOne({ userId: user._id });
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    if (!token) {
      await TokenMetadata.create({
        userId: user._id,
        refreshToken,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        expiresAt: expiresAt,
      });
    }
    else {
      token.refreshToken = refreshToken;
      token.expiresAt = expiresAt;
      token.updatedAt = new Date();
      await token.save();
    }

    res.json({ message: 'Login successful', accessToken, refreshToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get the user profile when authenticated
/** 
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * /api/auth/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: User profile retrieved successfully message
 *                 user:
 *                   type: object
 *                   description: User object
 *       401:
 *         description: Unauthorized
*/
const profile = (req, res) => {
  res.json({ message: 'You are authenticated', user: req.user });
};

module.exports = { register, login, profile };