// schemas/session.js
module.exports = {
    Session: {
      type: 'object',
      properties: {
        number: {
          type: 'number',
          description: 'The session number (1-25)',
          example: 1,
        },
        date: {
          type: 'string',
          format: 'date-time',
          description: 'The date of the session',
          example: '2023-11-01T10:00:00Z',
        },
        topic: {
          type: 'string',
          description: 'The topic covered in the session',
          example: 'Introduction to verb conjugation',
        },
        completed: {
          type: 'boolean',
          description: 'Whether the session was completed',
          example: true,
        },
        notes: {
          type: 'string',
          description: 'Additional notes about the session',
          example: 'Students struggled with verb conjugation',
        },
      },
    },
  };