module.exports = {
    User: {
      type: 'object',
      properties: {
        _id: {
          type: 'string',
          format: 'ObjectId',
          description: 'The auto-generated ID of the user',
          example: '507f1f77bcf86cd799439011', 
        },
        name: {
          type: 'string',
          description: 'The user\'s first name',
          example: 'John',
        },
        lastName: {
            type: 'string',
            description: 'The user\'s last name',
            example: 'Doe',
          },
        email: {
          type: 'string',
          format: 'email',
          description: 'The user\'s email address',
          example: 'john.doe@example.com',
        },
        password: {
          type: 'string',
          format: 'password',
          description: 'The user\'s password',
        },
        roleId: {
          type: 'string',
          format: 'ObjectId',
          description: 'The user\'s role',
          example: 'student',
        },
        createdAt: {
          type: 'string',
          format: 'date-time',
          description: 'The timestamp when the user was created',
          example: '2023-10-15T12:00:00Z',
        },
        updatedAt: {
          type: 'string',
          format: 'date-time',
          description: 'The timestamp when the user was last updated',
          example: '2023-10-15T12:00:00Z',
        },
      },
    },
  };