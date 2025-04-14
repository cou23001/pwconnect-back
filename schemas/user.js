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
        firstName: {
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
        phone: {
          type: 'string',
          description: 'The user\'s phone number',
          example: '123-456-7890',
        },
        type: {
          type: 'number',
          description: 'The user\'s type (1 = Student, 10 = Admin, 11 = Instructor)',
          example: 1,
        },
        wardId: {
            $ref: '#/components/schemas/Ward',
        },
        password: {
          type: 'string',
          format: 'password',
          description: 'The user\'s password',
        },
        avatar: {
          type: 'string',
          format: 'url',
          description: 'The URL of the user\'s avatar image',
          example: 'https://example.com/avatar.jpg',
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