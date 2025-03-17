// schemas/userRole.js

module.exports = {
  UserRole: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        format: 'ObjectId',
        description: 'The auto generated ID of the user role',
        example: '507f1f77bcf86cd799439011',
      },
      name: {
        type: 'string',
        description: 'The role\'s name',
        example: 'admin',
      },
      description: {
        type: 'string',
        description: 'The role\'s description',
        example: 'Admin role',
      },
    },
  },
};