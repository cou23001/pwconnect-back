module.exports = {
  UserRole: {
    type: 'object',
    properties: {
      _id: {
        type: 'string',
        format: 'ObjectId',
        description: 'The auto-generated ID of the user role',
        example: '67e77992c77e3fbd62509403',
      },
      name: {
        type: 'string',
        description: 'The role\'s name',
        example: 'Super Administrator',
      },
      description: {
        type: 'string',
        description: 'The role\'s description',
        example: 'Admin role',
      },
      userPermissions: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              format: 'ObjectId',
              description: 'The unique ID of the user permission',
              example: '67e77992c77e3fbd62509404',
            },
            name: {
              type: 'string',
              description: 'The name of the permission',
              example: 'create',
            },
            description: {
              type: 'string',
              description: 'The description of the permission',
              example: 'Can create records',
            },
          },
          required: ['_id', 'name', 'description'],
        },
        description: 'The permissions associated with the role',
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
        description: 'The date and time when the role was created',
        example: '2025-03-29T04:39:46.976Z',
      },
      updatedAt: {
        type: 'string',
        format: 'date-time',
        description: 'The date and time when the role was last updated',
        example: '2025-03-29T05:00:42.546Z',
      },
    },
    required: ['_id', 'name', 'userPermissions', 'createdAt', 'updatedAt'],
  },
};
