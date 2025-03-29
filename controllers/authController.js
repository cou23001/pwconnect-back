// controllers/authController.js
const User = require('../models/user');
const { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken } = require('../config/jwt');
const TokenMetadata = require('../models/tokenMetadata');
const UserRole = require('../models/userRole');
const argon2 = require('argon2');

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
 *                 example: 'password123'
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
      roleId: userRole._id,
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
 *                 accessToken:
 *                   type: string
 *                   description: Access token
 *                 refreshToken:
 *                   type: string
 *                   description: Refresh token
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

    // Hash the refresh token
    const hashedRefreshToken = await argon2.hash(refreshToken);

    // Save the refresh token in the database (associated with the user)
    const token = await TokenMetadata.findOne({ userId: user._id });
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    if (!token) {
      await TokenMetadata.create({
        userId: user._id,
        refreshToken: hashedRefreshToken,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        expiresAt: expiresAt,
        updatedAt: new Date(),
      });
    }
    else {
      token.refreshToken = hashedRefreshToken;
      token.ipAddress = req.ip;
      token.userAgent = req.headers['user-agent'];
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

// Function to get access token and refresh token from a refresh token
/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     summary: Refresh access and refresh token
 *     tags: [Auth]
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         required: true
 *         schema:
 *           type: string
 *           description: >-
 *             **Refresh token** in Bearer format.  
 *             - Must be a valid, unexpired refresh token.  
 *             - Sent as `Bearer <token>` (no quotes around the token).  
 *           example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
 *         example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'  # Explicit example field
 *     responses:
 *       200:
 *         description: Access token refreshed successfully
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *             description: HTTP-only cookie containing the new refresh token
 *             example: refreshToken=abc123; HttpOnly; Secure; SameSite=strict; Path=/api/auth/refresh; Max-Age=604800
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                   example: 'Tokens refreshed successfully'
 *                 accessToken:
 *                   type: string
 *                   description: New short-lived access token (JWT)
 *                   example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *                   example: 'Unauthorized'
*/
const refreshToken = async (req, res) => {
  // 1. Extract refresh token from Authorization header
  const authHeader = req.headers['authorization'];
  const refreshToken = authHeader?.split(' ')[1]; // Optional chaining

  if (!refreshToken) {
    return res.status(401).json({ error: 'Refresh token is required' });
  }

  try {
    // 2. Verify the JWT structure (if signed) and extract user ID
    const user = verifyRefreshToken(refreshToken); // Checks signature/expiry
    if (!user?.id) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    // 3. Fetch hashed token from DB
    const tokenMetadata = await TokenMetadata.findOne({ userId: user.id });
    if (!tokenMetadata) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    // 4. Validate against hashed token (argon2)
    const isValidToken = await argon2.verify(tokenMetadata.refreshToken, refreshToken);
    if (!isValidToken || tokenMetadata.isRevoked) {
      return res.status(403).json({ error: 'Invalid or revoked token' });
    }

    // 5. Generate new tokens
    const newAccessToken = generateAccessToken(user);
    const newRawRefreshToken = generateRefreshToken(user); // Generate new random token
    const newHashedRefreshToken = await argon2.hash(newRawRefreshToken);

    // 6. Update DB atomically (prevent race conditions)
    tokenMetadata.refreshToken = newHashedRefreshToken;
    tokenMetadata.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    tokenMetadata.ipAddress = req.ip;
    tokenMetadata.userAgent = req.headers['user-agent'];
    await tokenMetadata.save();

    // 7. Return new tokens (send refresh token securely via HTTP-only cookie in production)
    //res.json({
    //  message: 'Tokens refreshed successfully',
    //  accessToken: newAccessToken,
    //  refreshToken: newRawRefreshToken, // Or omit if using cookies
    //});

    // 7. Return with httpOnly cookie
    res.cookie('refreshToken', newRawRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      sameSite: 'strict', // Prevent CSRF attacks
      path: '/api/auth/refresh-token',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.json({
      message: 'Tokens refreshed successfully',
      accessToken: newAccessToken,
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
// Logout user
/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         required: true
 *         schema:
 *           type: string
 *           description: 'The access token passed as Bearer token (e.g., Authorization: Bearer <refresh_token>)'
 *           example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
 *     responses:
 *       200:
 *         description: User logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: User logged out successfully message
 *                   example: 'User logged out successfully'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *                   example: 'Bad request'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *                   example: 'Unauthorized'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *                   example: 'Internal Server Error'
*/
const logout = async (req, res) => {
  try {
    // Get access token from the authorization header
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization header is missing' });
    }
    
    const accessToken = authHeader.split(' ')[1];
    if (!accessToken) {
      return res.status(401).json({ error: 'Access token is missing' });
    }

    // Verify the access token and get user ID
    let userId;
    try {
      const decoded = verifyAccessToken(accessToken);
      userId = decoded.id;
    } catch (err) {
      return res.status(401).json({ error: 'Invalid access token' });
    }

    // Get the token metadata associated with the user
    const tokenMetaData = await TokenMetadata.findOne({ userId });
    if (!tokenMetaData) {
      return res.status(401).json({ error: 'Token metadata not found' });
    }

    const refreshToken = tokenMetaData.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token is missing' });
    }

    // Remove the token metadata from the database
    await TokenMetadata.deleteOne({ refreshToken });

    // Respond with success message
    res.json({ message: 'User logged out successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
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

module.exports = { register, login, profile, refreshToken, logout };