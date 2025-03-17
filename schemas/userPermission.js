const UserPermission = require("../models/userPermission");

//schemas/userPermission.js
module.exports = {
  UserPermission: {
      type: 'object',
      properties: {
          id: {
              type: 'string',
              format: 'ObjectId',
              description: 'The auto-generated ID of the user permission',
              example: '507f1f77bcf86cd799439011'
          },
          name: {
              type: 'string',
              description: 'The permission\'s name',
          },
          description: {
              type: 'string',
              description: 'The permission\'s description',
          },
      },
  },
};