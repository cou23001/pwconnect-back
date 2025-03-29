// schemas/group.js
module.exports = {
    Group: {
      type: 'object',
      properties: {
        _id: {
          type: 'string',
          format: 'ObjectId',
          description: 'The auto generated ID of the Group',
          example: '507f1f77bcf86cd799439011',
        },
        name: {
          type: 'string',
          description: 'The name of the Group',
          example: 'Basic English Group A',
        },
        stake: {
          type: 'string',
          description: 'The stake where the Group is located',
          example: 'Stake1',
        },
        ward: {
          type: 'string',
          description: 'The ward where the Group is located',
          example: 'Ward1',
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
        other_group_data: {
          type: 'object',
          description: 'Other relevant data of the Group',
          example: { teacher: 'John Doe', room: 'Room 101' },
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