module.exports = {
    User: {
      type: 'object',
      properties: {
        _id: {
          type: 'integer',
          format: 'ObjectId',
          description: 'The auto-generated ID of the user',
          example: '507f1f77bcf86cd799439011', 
        },
        name: {
          type: 'string',
          description: 'The user\'s name',
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
        hashedPassword: {
          type: 'string',
          format: 'password',
          description: 'The user\'s password',
        },
      },
    },
  };