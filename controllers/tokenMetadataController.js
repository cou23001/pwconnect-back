const TokenMetadata = require('../models/tokenMetadata');
const argon2 = require('argon2');

/**
 * @swagger
 * tags:
 *   name: TokenMetadata
 *   description: Token metadata management
 */

/**
 * @swagger
 * /api/token-metadata/{id}:
 *   get:
 *     summary: Get token metadata by id (validates refresh token)}
 *     description: |
 *       - Retrieves token metadata by its ID and validates the refresh token.
 *       - Requires both a valid access token (Bearer) and refresh token.
 *     tags: [TokenMetadata]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the token metadata to retrieve
 *         schema:
 *           type: string
 *           description: The ID of the token metadata
 *       - in: header
 *         name: X-Refresh-Token
 *         schema:
 *           type: string
 *           required: true
 *           description: The refresh token to validate
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: The refresh token to validate
 *                 example: "refresh_token_value"
 *     responses:
 *       200:
 *         description: Token metadata retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Token metadata retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                    _id:
 *                      type: string
 *                      format: ObjectId
 *                      description: The auto-generated ID of the refresh token
 *                      example: 507f1f77bcf86cd799439012
 *                    userId:
 *                      type: object
 *                      properties:
 *                        _id:
 *                          type: string
 *                          format: ObjectId
 *                          description: The ID of the user associated with the refresh token
 *                          example: 507f1f77bcf86cd799439011
 *                        firstName:
 *                          type: string
 *                          description: The first name of the user
 *                          example: John
 *                        lastName:
 *                          type: string
 *                          description: The last name of the user
 *                          example: Doe
 *                        email:
 *                          type: string
 *                          format: email
 *                          description: The email address of the user
 *                        type:
 *                          type: number
 *                          description: The type of the user (1 = Student, 10 = Admin, 11 = Instructor)
 *                          example: 1
 *                    ipAddress:
 *                      type: string
 *                      description: The IP address of the device that requested the refresh token
 *                    refreshToken:
 *                      type: string
 *                      description: The hashed refresh token
 *                      example: hashed_refresh_token_value
 *                    userAgent:
 *                      type: string
 *                      description: The user agent (browser/device) information of the client
 *                      example: Mozilla/5.0 (Windows NT 10.0; Win64; x64)
 *                    isRevoked:
 *                      type: boolean
 *                      description: Indicates whether the refresh token is revoked
 *                      example: false
 *                    expiresAt:
 *                      type: string
 *                      format: date-time
 *                      description: The expiration date and time of the refresh token
 *                      example: 2025-03-29T04:39:46.976Z
 *                    createdAt:
 *                      type: string
 *                      format: date-time
 *                      description: The date and time when the refresh token was created
 *                      example: 2025-03-29T04:39:46.976Z
 *                    updatedAt:
 *                      type: string
 *                      format: date-time
 *                      description: The date and time when the refresh token was last updated
 *                      example: 2025-03-29T05:00:42.546Z
 *       403:
 *         description: Forbidden (e.g., token expired or revoked)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Token expired"
 *       404:
 *         description: Refresh token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Token metadata not found"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to retrieve token metadata"
 */
const getTokenMetadataById = async (req, res) => {
  try {
    const { id } = req.params;
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
      return res.status(401).json({ error: 'Refresh token required' });
    }

    // Check token validity in one query
    const tokenMetadata = await TokenMetadata.findOne({
      _id: id,
      expiresAt: { $gt: new Date() },  // Not expired
      isRevoked: false                 // Not revoked
    }).populate('userId', 'firstName lastName email type');

    if (!tokenMetadata) {
      return res.status(403).json({ error: 'Token invalid or expired' });
    }

    // Verify the incoming token against the hashed version
    const isValid = await argon2.verify(
      tokenMetadata.refreshToken, // Hashed token (from DB)
      incomingRefreshToken        // Plaintext token (from request)
    );

    if (!isValid) {
      return res.status(403).json({ error: 'Invalid refresh token' });
    }

    res.status(200).json({ 
      message: 'Token metadata retrieved successfully', 
      data: tokenMetadata 
    });

  } catch (error) {
    console.error('Error retrieving token metadata:', error);
    res.status(500).json({ error: 'Failed to retrieve token metadata' });
  }
};

module.exports = { getTokenMetadataById };