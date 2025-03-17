const TokenMetadata = require('../models/tokenMetadata');
const jwt = require('jsonwebtoken');
const { generateRefreshToken, generateAccessToken } = require('../config/jwt');

// Create a token metadata
/**
 * @swagger
 * tags:
 *   name: TokenMetadata
 *   description: Token metadata management
 */
/**
 * @swagger
 * /api/refresh-tokens:
 *   post:
 *     summary: Create a new refresh token
 *     tags: [RefreshTokens]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - ipAddress
 *               - userAgent
 *             properties:
 *               userId:
 *                 type: string
 *                 format: ObjectId
 *                 description: The ID of the user associated with the refresh token
 *                 example: '507f1f77bcf86cd799439011'
 *               ipAddress:
 *                 type: string
 *                 description: The IP address of the device that requested the refresh token
 *                 example: '192.168.1.1'
 *               userAgent:
 *                 type: string
 *                 description: The user agent (browser/device) information of the client
 *                 example: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
 *     responses:
 *       200:
 *         description: Refresh token created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 refreshToken:
 *                   type: string
 *                   description: The newly created refresh token
 *                   example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
 *       400:
 *         description: Bad Request (e.g., missing required fields)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 'Missing required fields'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 'Failed to create refresh token'
 */
const createTokenMetadata = async (req, res) => {
  // Extract the refresh token from the Authorization header
  const authHeader = req.headers['authorization'];
  const refreshToken = authHeader && authHeader.split(' ')[1]; // Format: "Bearer <token>"

  if (!refreshToken) {
    return res.status(401).json({ error: 'Refresh token is required' });
  }
  try {
    // Decode the refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Find the refresh token in the database
    const tokenRecord = await TokenMetadata.findOne({
      userId: decoded.id,
      isRevoked: false,
      expiresAt: { $gt: new Date() }, // Check if the token is not expired
    });

    if (!tokenRecord) {
      return res.status(403).json({ error: 'Invalid refresh token' });
    }

    const isValid = (tokenRecord.refreshToken === refreshToken);
    if (!isValid) {
      return res.status(403).json({ error: 'Invalid refresh token' });
    }

    // Generate a new access token
    const accessToken = generateAccessToken({ id: decoded.id });

    // Generate a new refresh token
    const newRefreshToken = generateRefreshToken({ id: decoded.id });

    // Update the refresh token in the database
    tokenRecord.refreshToken = newRefreshToken;
    tokenRecord.ipAddress = req.ip;
    tokenRecord.userAgent = req.headers['user-agent'];
    tokenRecord.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await tokenRecord.save();

    // Return the new tokens
    res.json({ accessToken: accessToken, refreshToken: newRefreshToken });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create refresh token', details: error });
  }
};

// Get a refresh token by email
/**
 * @swagger
 * /api/token-metadata/{email}:
 *   get:
 *     summary: Get token metadata by email
 *     tags: [TokenMetadata]
 *     responses:
 *       200:
 *         description: Token metadata retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - _id
 *                 - userId
 *                 - refreshToken
 *               properties:
 *                 _id:
 *                   type: string
 *                   format: ObjectId
 *                   description: The auto-generated ID of the refresh token
 *                   example: 507f1f77bcf86cd799439012
 *                 userId:
 *                   type: string
 *                   format: ObjectId
 *                   description: The ID of the user associated with the refresh token
 *                   example: 507f1f77bcf86cd799439011
 *                 refreshToken:
 *                   type: string
 *                   description: The hashed refresh token
 *                   example: hashed_refresh_token_value
 *       404:
 *         description: Refresh token
 *       500:
 *         description: Internal Server Error
 */
const getTokenMetadataByEmail = async (email) => {
  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('User not found');
    }

    // Find the refresh token associated with the user
    const tokenRecord = await RefreshToken.findOne({ userId: user._id });
    if (!tokenRecord) {
      throw new Error('Refresh token not found');
    }

    return tokenRecord;
  } catch (error) {
    throw new Error('Failed to retrieve refresh token');
  }
};

module.exports = { createTokenMetadata, getTokenMetadataByEmail };