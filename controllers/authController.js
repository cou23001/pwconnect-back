// controllers/authController.js
const User = require('../models/user');
const Student = require('../models/student');
const { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken } = require('../config/jwt');
const TokenMetadata = require('../models/tokenMetadata');
const argon2 = require('argon2');
const { parseEnvTimeToMs } = require('../utils/timeParser'); // Utility function to parse time from environment variables
const mongoose = require('mongoose');
const { userSchema } = require('../validators/user');
const dotenv = require("dotenv");
dotenv.config();
const DEFAULT_AVATAR_URL = process.env.DEFAULT_AVATAR_URL;

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
 *               type:
 *                 type: number
 *                 enum: [1, 10, 11]
 *                 default: 1
 *                 description: The user's type (1 = Student, 10 = Admin, 11 = Instructor)
 *                 example: 1
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
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the registration was successful
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 'User registered successfully'
 *                   description: Confirmation message
 *                 accessToken:
 *                   oneOf:
 *                     - type: string
 *                     - type: 'null'
 *                   description: >-
 *                     [Mobile clients only] Refresh token for native apps.
 *                     Web clients receive this via HTTP-only cookie.
 *                   example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
 *                 refreshToken:
 *                   type: string
 *                   nullable: true
 *                   description: >-
 *                     [Mobile clients only] Refresh token for native apps.
 *                     Web clients receive this via HTTP-only cookie.
 *                   example: 'def50200f2f3d1d4b8b9e6c2...'
 *       400:
 *         description: User already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *                   example: 'User already exists'
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
 *                   example: 'Internal server error'
*/
const register = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    // 0. Validate request body
    const { error, value } = userSchema.validate(req.body);
    if (error) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ error: error.details[0].message });
    }

    // Use the validated value which includes defaults
    const { firstName, lastName, email, password, type } = value;

    // 2. Check for existing user
    const existingUser = await User.findOne({ email }).session(session);
    if (existingUser) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ error: 'User already exists' });
    }
    // 3.1 Create user with hashed password
    const user = new User({ 
      firstName, 
      lastName, 
      email, 
      password, 
      type, // 1 = Student, 10 = Admin, 11 = Instructor
      wardId: null, // Set to null for now
      avatar: DEFAULT_AVATAR_URL || 'https://www.gravatar.com/avatar/default?d=identicon', // Default avatar URL
    });
    await user.save({ session });

    // 3.2 Create student profile if the type is 1 (Student)
    // Note: The addressId, birthDate, phone, language, and level are set to null for now
    if (type === 1) { // 1 = Student
      const student = new Student({
        userId: user._id,
        addressId: null, 
        birthDate: null, 
        phone: null, 
        language: null, 
        level: null,
        churchMembership: null,
      });
      await student.save({ session });
    }

    // 4. Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    const hashedRefreshToken = await argon2.hash(refreshToken);

    // 5. Store hashed refresh token
    await TokenMetadata.create([{
      userId: user._id,
      refreshToken: hashedRefreshToken,
      ipAddress: req.clientIp,
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
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Registration error:', error.message || error);
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
 *                 example: 'john@example.com'
 *               password:
 *                 type: string
 *                 format: password
 *                 description: The user's password
 *                 example: 'password123'
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
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the logout was successful
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 'Login successful'
 *                 accessToken:
 *                   type: string
 *                   description: Short-lived JWT (typically 15-30 minutes)
 *                   example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
 *                 user:
 *                   type: object
 *                   description: User object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: User ID
 *                       example: '60d5ec49f1b2c8a3f4e8b8c1'
 *                     email:
 *                       type: string
 *                       description: User email
 *                       example: 'john@example.com'
 *                     name:
 *                       type: string
 *                       description: User name
 *                       example: 'John Doe'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *                   example: 'Invalid credentials'
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
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user and validate credentials
    const user = await User.findOne({ email }).populate({
      path: 'wardId',
      populate: {
        path: 'stakeId'
      }
    });
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
        ipAddress: req.clientIp,
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
      user: {
        _id: user._id,
        email: user.email,
        name: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : 'No name set',
        type: user.type,
      },
      ...(!isWebClient && { refreshToken }), // Only for non-web clients
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Function to validate an access token
/**
 * @swagger
 * /api/auth/validate:
 *   get:
 *     summary: Validate access token
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Access token is valid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Access token is valid message
 *                   example: 'User found'
 *                 user:
 *                   type: object
 *                   description: User object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: User ID
 *                       example: '60d5ec49f1b2c8a3f4e8b8c1'
 *                     email:
 *                       type: string
 *                       description: User email
 *                       example: 'john@example.com'
 *                     type:
 *                       type: number
 *                       description: User type (1 = Student, 10 = Admin, 11 = Instructor)
 *                       example: 1
 *                     iat:
 *                       type: number
 *                       description: Issued at timestamp
 *                       example: 1633036800
 *                     exp:
 *                       type: number
 *                       description: Expiration timestamp
 *                       example: 1633040400
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
const validate = async (req, res) => {
  try {
    // 1. Get access token from the Authorization header
    const authHeader = req.headers['authorization'];
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or malformed Authorization header' });
    }
    
    const accessToken = authHeader.split(' ')[1];
    if (!accessToken) {
      return res.status(401).json({ error: 'Access token is missing' });
    }

    // 2. Verify access token
    let user;
    try {
      user = verifyAccessToken(accessToken); // should return decoded token (e.g., { _id, email, ... })
    } catch (err) {
      return res.status(401).json({ error: 'Invalid or expired access token' });
    }

    // 3. Check if user exists in the database
    const existingUser = await User.findById(user._id);
    if (!existingUser) {
      return res.status(401).json({ error: 'User not found' });
    }

    // 4. Return user information from the access token
    res.status(200).json({ message: 'User found', user})
  }
  catch(error) {
    console.log(error)
    res.status(500).json({error: "Internal Server Error"});
  }
};

// Function to get access token and refresh token from a refresh token
/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     summary: Refresh access and refresh token
 *     tags: [Auth]
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
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the refresh was successful
 *                   example: true
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
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *                   example: 'Invalid or revoked tokens'
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
    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch (error) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    if (!decoded?._id) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // Fetch full user info to include in new access token
    const user = await User.findById(decoded._id).select('id email type');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Validate against hashed DB token
    const tokenMetadata = await TokenMetadata.findOne({ userId: user._id });
    if (!tokenMetadata || !(await argon2.verify(tokenMetadata.refreshToken, refreshToken))) {
      return res.status(403).json({ error: 'Invalid or revoked tokens' });
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
        ipAddress: req.clientIp,
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
 *     responses:
 *       200:
 *         description: User logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the logout was successful
 *                   example: true
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
    // 1. Get access token from the Authorization header
    const authHeader = req.headers['authorization'];
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or malformed Authorization header' });
    }
    
    const accessToken = authHeader.split(' ')[1];
    if (!accessToken) {
      return res.status(401).json({ error: 'Access token is missing' });
    }

    // 2. Verify access token and extract user ID
    let userId;
    try {
      const decoded = verifyAccessToken(accessToken);
      userId = decoded._id;
    } catch (err) {
      console.error('Logout failed: Invalid access token', err);
      return res.status(401).json({ error: 'Invalid access token' });
    }

    // 3. Remove the token metadata for the user (logout)
    const result = await TokenMetadata.deleteOne({ userId });

    if (result.deletedCount === 0) {
      console.warn(`Logout warning: No active session found for user ${userId}`);
    }

    // 4. Clear refresh token cookie if it's a web client
    if (req.headers['user-agent']?.includes('Mozilla')) {
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/api/auth',
      });
    }

    // 5. Respond with success
    res.status(200).json({
      success: true,
      message: 'User logged out successfully',
    });
  } catch (error) {
    console.error('Logout error:', error.message || error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// Get the user profile when authenticated
/** 
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Auth]
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
 *                   example: 'You are authenticated'
 *                 user:
 *                   type: object
 *                   description: User object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: User ID
 *                       example: '60d5ec49f1b2c8a3f4e8b8c1'
 *                     email:
 *                       type: string
 *                       description: User email
 *                       example: user@example.com
 *                     type:
 *                       type: number
 *                       description: User type (1 = Student, 10 = Admin, 11 = Instructor)
 *                       example: 1
 *                     avatar:
 *                       type: string
 *                       description: User avatar URL
 *                       example: 'https://example.com/avatar.jpg'
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: User creation date
 *                       example: '2023-10-01T12:00:00Z'
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: User update date
 *                       example: '2023-10-01T12:00:00Z'
 *       401:
 *         description: Unauthorized
*/
const profile = async (req, res) => {
  try {
    // 1. Get access token from the Authorization header
    const authHeader = req.headers['authorization'];
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or malformed Authorization header' });
    }
    
    const accessToken = authHeader.split(' ')[1];
    if (!accessToken) {
      return res.status(401).json({ error: 'Access token is missing' });
    }

    // 2. Verify access token and extract user ID
    let userId;
    try {
      const decoded = verifyAccessToken(accessToken);
      userId = decoded._id;
    } catch (err) {
      console.error('Profile retrieval failed: Invalid access token', err);
      return res.status(401).json({ error: 'Invalid access token' });
    }

    // 3. Find user in the database
    const user = await User.findById(userId).select('-password'); // Exclude password field
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // 4. Respond with user profile
    res.status(200).json({
      message: 'You are authenticated',
      user,
    });
  } catch (error) {
    console.error('Profile retrieval error:', error.message || error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { register, login, profile, refreshToken, logout, validate };