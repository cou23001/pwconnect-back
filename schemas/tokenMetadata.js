module.exports = {
    TokenMetadata: {
      type: 'object',
      properties: {
        _id: {
          type: 'string',
          format: 'ObjectId',
          description: 'The auto-generated ID of the refresh token',
          example: '507f1f77bcf86cd799439012',
        },
        userId: {
          type: 'string',
          format: 'ObjectId',
          description: 'The ID of the user associated with the refresh token',
          example: '507f1f77bcf86cd799439011',
        },
        refreshToken: {
          type: 'string',
          description: 'The hashed refresh token',
          example: 'hashed_refresh_token_value',
        },
        createdAt: {
          type: 'string',
          format: 'date-time',
          description: 'The timestamp when the refresh token was created',
          example: '2023-10-15T12:00:00Z',
        },
        updatedAt: {
          type: 'string',
          format: 'date-time',
          description: 'The timestamp when the refresh token was last updated',
          example: '2023-10-15T12:00:00Z',
        },
        lastUsedAt: {
          type: 'string',
          format: 'date-time',
          description: 'The timestamp when the refresh token was last used',
          example: '2023-10-15T12:00:00Z',
        },
        ipAddress: {
          type: 'string',
          description: 'The IP address of the device that requested the refresh token',
          example: '192.168.1.1',
        },
        userAgent: {
          type: 'string',
          description: 'The user agent (browser/device) information of the client',
          example: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        },
        isRevoked: {
          type: 'boolean',
          description: 'Indicates whether the refresh token has been revoked',
          example: false,
        },
        expiresAt: {
          type: 'string',
          format: 'date-time',
          description: 'The expiration timestamp of the refresh token',
          example: '2023-10-22T12:00:00Z',
        },
        deviceId: {
          type: 'string',
          description: 'Unique identifier for the device (optional)',
          example: 'device123',
        },
        location: {
          type: 'string',
          description: 'Geographic location of the client (optional)',
          example: 'New York, USA',
        },
      },
    },
  };