const TokenMetadata = require('../models/tokenMetadata');
const { generateRefreshToken } = require('../config/jwt');

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
 *             properties:
 *               userId:
 *                 type: string
 *                 format: ObjectId
 *                 description: The ID of the user associated with the refresh token
 *                 example: '507f1f77bcf86cd799439011'
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
const createTokenMetadata = async (user, refreshToken, ipAddress, userAgent) => {
  try {
    // Generate a refresh token
    //const refreshToken = generateRefreshToken(user);

    // Save the refresh token in the database
    const tokenRecord = await TokenMetadata.create({
      userId: user._id,
      refreshToken,
      ipAddress,
      userAgent,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    // Return the plain-text refresh token to the client
    return refreshToken;
  } catch (error) {
    throw new Error('Failed to create refresh token');
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