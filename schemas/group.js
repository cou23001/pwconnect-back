// schemas/group.js

const session = require("./session");

module.exports = {
    Group: {
      type: 'object',
      properties: {
        _id: {
          type: 'string',
          format: 'objectid',
          description: 'The auto generated ID of the Group',
          example: '507f1f77bcf86cd799439011',
        },
        name: {
          type: 'string',
          description: 'The name of the Group',
          example: 'EC1 Group A',
        },
        wardId: {
          type: 'string',
          format: 'objectid',
          description: 'The ID of the ward associated with the Group',
          example: '507f1f77bcf86cd799439012',
        },
        start_date: {
          type: 'string',
          format: 'date-time',
          description: 'The start date of the Group',
          example: '2023-11-01T10:00:00Z',
        },
        end_date: {
          type: 'string',
          format: 'date-time',
          description: 'The end date of the Group',
          example: '2023-12-15T12:00:00Z',
        },
        schedule: {
          type: 'string',
          description: 'The schedule of the Group',
          example: 'Mondays and Wednesdays, 7:00 PM',
        },
        room: {
          type: 'string',
          description: 'Clssroom information',
          example: 'Room 101',
        },
        instructorId: {
          type: 'string',
          format: 'objectid',
          description: 'The id of the instructor',
          example: '5f3f9c5f6d7a0f0021e9d4b7',
        },
        sessions: {
          type: 'array',
          items: session.Session,
          description: 'The list of sessions associated with the Group',
        },
        createdAt: {
          type: 'string',
          format: 'date-time',
          description: 'The timestamp when the Group was created',
          example: '2023-10-15T12:00:00Z',
        },
        updatedAt: {
          type: 'string',
          format: 'date-time',
          description: 'The timestamp when the Group was last updated',
          example: '2023-10-15T12:00:00Z',
        },
      },
    },
  };