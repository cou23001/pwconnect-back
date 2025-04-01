// controllers/authController.js
const User = require('../models/user');
const { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken } = require('../config/jwt');
const TokenMetadata = require('../models/tokenMetadata');
const UserRole = require('../models/userRole');
const argon2 = require('argon2');
const { parseEnvTimeToMs } = require('../utils/timeParser'); // Utility function to parse time from environment variables
const mongoose = require('mongoose');

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
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *             description: >-
 *               [Web clients only] HTTP-only secure cookie containing refresh token.
 *               Security attributes:
 *               - HttpOnly (XSS protection)
 *               - Secure (HTTPS-only in production)
 *               - SameSite=strict (CSRF protection)
 *               - Path=/api/auth (restricted path)
 *               - Max-Age={JWT_REFRESH_EXPIRATION}
 *             example: refreshToken=abc123; HttpOnly; Secure; SameSite=strict; Path=/api/auth; Max-Age=604800
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'User registered successfully'
 *                   description: Confirmation message
 *                 accessToken:
 *                   type: string
 *                   example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
 *                   description: Short-lived access token (typically 15-30 minutes)
 *                 refreshToken:
 *                   type: string
 *                   nullable: true
 *                   description: >-
 *                     [Mobile clients only] Refresh token for native apps.
 *                     Web clients receive this via HTTP-only cookie.
 *                   example: 'def50200f2f3d1d4b8b9e6c2...'
 *       400:
 *         description: User already exists
 *       500:
 *         description: Internal Server Error
*/
const register = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { firstName, lastName, email, password, role } = req.body;

    // 1. Validate role
    const roleName = role || 'student';
    const userRole = await UserRole.findOne({ name: roleName }).session(session);
    if (!userRole) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ error: `Role '${roleName}' not found` });
    }

    // 2. Check for existing user
    const existingUser = await User.findOne({ email }).session(session);
    if (existingUser) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ error: 'User already exists' });
    }

    // 3. Create user with hashed password
    const user = new User({ 
      firstName, 
      lastName, 
      email, 
      password, // Ensure User model hashes this automatically
      roleId: userRole._id,
    });
    await user.save({ session });

    // 4. Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    const hashedRefreshToken = await argon2.hash(refreshToken);

    // 5. Store hashed refresh token
    await TokenMetadata.create([{
      userId: user._id,
      refreshToken: hashedRefreshToken,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      expiresAt: new Date(Date.now() + parseEnvTimeToMs(process.env.JWT_REFRESH_EXPIRATION)),
    }], { session });

    // 6. Commit transaction
    await session.commitTransaction();
    session.endSession();

    // 7. Handle response based on client type
    const isWebClient = req.headers['user-agent']?.includes('Mozilla');

    if (isWebClient) {
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/api/auth',
        maxAge: parseEnvTimeToMs(process.env.JWT_REFRESH_EXPIRATION),
      });
    }

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      accessToken,
      ...(!isWebClient && { refreshToken }), // Only for mobile
      user: { id: user._id, email: user.email }, // Optional
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
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
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *             description: >-
 *               HTTP-only secure cookie containing refresh token.
 *               - Auto-sent to `/api/auth` endpoints
 *               - Not accessible to JavaScript (XSS protection)
 *               - HTTPS-only in production
 *               - Expires in 1 day
 *             example: refreshToken=abc123; HttpOnly; Secure; SameSite=strict; Path=/api/auth; Max-Age=86400000
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - message
 *                 - accessToken
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Login successful'
 *                 accessToken:
 *                   type: string
 *                   description: Short-lived JWT (typically 15-30 minutes)
 *                   example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
*/
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user and validate credentials
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // 2. Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    const hashedRefreshToken = await argon2.hash(refreshToken);

    // 3. Update token metadata
    const expiresAt = new Date(Date.now() + parseEnvTimeToMs(process.env.JWT_REFRESH_EXPIRATION)); // 7 days
    await TokenMetadata.findOneAndUpdate(
      { userId: user._id },
      {
        refreshToken: hashedRefreshToken,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        expiresAt,
        updatedAt: new Date(),
      },
      { upsert: true } // Create if doesn't exist
    );

    // 4. Set HTTP-only cookie for web clients
    const isWebClient = req.headers['user-agent']?.includes('Mozilla');
    if (isWebClient) {
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/api/auth',
        maxAge: parseEnvTimeToMs(process.env.JWT_REFRESH_EXPIRATION),
      });
    }

    // 5. Single response
    res.json({
      success: true,
      message: 'Login successful',
      accessToken,
      ...(!isWebClient && { refreshToken }), // Only for non-web clients
    });

  } catch (error) {
    console.error('Login error:', error);
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
 *     security:
 *       - bearerAuth: []  # Require Bearer Authentication
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
  let refreshToken;
  if (req.headers.authorization?.startsWith('Bearer ')) {
    refreshToken = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.refreshToken) {
    refreshToken = req.cookies.refreshToken;
  }

  if (!refreshToken) {
    return res.status(401).json({ error: 'Refresh token required' });
  }

  try {
    let user;
    try {
      user = verifyRefreshToken(refreshToken);
    } catch (error) {
      console.error('Token verification failed:', error.message || error);
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    if (!user?.id) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // Validate against hashed DB token
    const tokenMetadata = await TokenMetadata.findOne({ userId: user.id });
    if (!tokenMetadata || !(await argon2.verify(tokenMetadata.refreshToken, refreshToken))) {
      return res.status(403).json({ error: 'Invalid or revoked token' });
    }

    // Generate new tokens
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);
    const newHashedToken = await argon2.hash(newRefreshToken);

    // Update database with new refresh token
    await TokenMetadata.findOneAndUpdate(
      { userId: user.id },
      {
        refreshToken: newHashedToken,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        expiresAt: new Date(Date.now() + parseEnvTimeToMs(process.env.JWT_REFRESH_EXPIRATION)),
      },
      { new: true }
    );

    // Determine if the request comes from a web client
    const isWebClient = req.headers['user-agent']?.includes('Mozilla');

    if (isWebClient) {
      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production' || req.protocol === 'https',
        sameSite: 'strict',
        path: '/api/auth',
        maxAge: parseEnvTimeToMs(process.env.JWT_REFRESH_EXPIRATION),
      });
    }

    res.json({
      success: true,
      accessToken: newAccessToken,
      ...(!isWebClient && { refreshToken: newRefreshToken }), // Only for mobile
    });

  } catch (error) {
    if (user!== null) {
      console.error(`[RefreshTokenError] UserID: ${user?.id || 'Unknown'} - Error:`, error.message);
    }
    else {
      console.error('[RefreshTokenError] Error:', error.message);
    }
    res.status(500).json({ error: 'Internal server error' });
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