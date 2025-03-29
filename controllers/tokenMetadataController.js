const TokenMetadata = require('../models/tokenMetadata');
const { verifyRefreshToken } = require('../config/jwt');

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
 *     summary: Get token metadata by id
 *     tags: [TokenMetadata]
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
 *                        roleId:
 *                          type: object
 *                          properties:
 *                            _id:
 *                              type: string
 *                              format: ObjectId
 *                              description: The ID of the role associated with the user
 *                              example: 507f1f77bcf86cd799439013
 *                            name:
 *                              type: string
 *                              description: The name of the role
 *                              example: admin
 *                            userPermissions:
 *                              type: array
 *                              items:
 *                                type: object
 *                                properties:
 *                                  _id:
 *                                    type: string
 *                                    format: ObjectId
 *                                    description: The ID of the user permission
 *                                    example: 507f1f77bcf86cd799439014
 *                                  name:
 *                                    type: string
 *                                    description: The name of the permission
 *                                    example: create
 *                                  description:
 *                                    type: string
 *                                    description: The description of the permission
 *                                    example: Can create records
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

    // Find the token metadata by ID populating the userId field and role
    const tokenMetadata = await TokenMetadata.findById(id)
      .populate({
        path: 'userId',
        populate: { path: 'roleId' }
      });
    if (!tokenMetadata) {
      return res.status(404).json({ error: 'Token metadata not found' });
    }
    // Check if the token is expired
    const currentDate = new Date();
    if (tokenMetadata.expiresAt < currentDate) {
      return res.status(403).json({ error: 'Token expired' });
    }
    // Check if the token is revoked
    if (tokenMetadata.isRevoked) {
      return res.status(403).json({ error: 'Token revoked' });
    }
    // Check if the token is valid
    const isValid = verifyRefreshToken(tokenMetadata.refreshToken);
    if (!isValid) {
      return res.status(403).json({ error: 'Invalid token' });
    }

    res.status(200).json({ message: 'Token metadata retrieved successfully', data: tokenMetadata });
  } catch (error) {
    console.error('Error retrieving token metadata:', error);
    res.status(500).json({ error: 'Failed to retrieve token metadata' });
  }
}

module.exports = { getTokenMetadataById };