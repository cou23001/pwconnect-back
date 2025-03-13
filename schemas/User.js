// schemas/user.js
module.exports = {
    User: {
      type: 'object',
      properties: {
        id: {
          type: 'integer',
          description: 'The auto-generated ID of the user',
        },
        name: {
          type: 'string',
          description: 'The user\'s name',
        },
        email: {
          type: 'string',
          format: 'email',
          description: 'The user\'s email address',
        },
        password: {
          type: 'string',
          format: 'password',
          description: 'The user\'s password',
        },
      },
    },
  };