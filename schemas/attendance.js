// schemas/attendance.js

module.exports = {
    Attendance: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          format: 'ObjectId',
          description: 'The auto-generated ID of the attendance record.',
          example: '507f1f77bcf86cd799439011',
        },
        studentId: {
          type: 'string',
          format: 'ObjectId',
          description: 'The ID of the student associated with the attendance record.',
          example: '607f1f77bcf86cd799439012',
        },
        groupId: {
          type: 'string',
          format: 'ObjectId',
          description: 'The ID of the group associated with the attendance record.',
          example: '707f1f77bcf86cd799439013',
        },
        date: {
          type: 'string',
          format: 'date-time',
          description: 'The date and time of the attendance record.',
          example: '2023-11-20T10:00:00Z',
        },
        isPresent: {
          type: 'boolean',
          description: 'Indicates whether the student was present (true) or absent (false).',
          example: true,
        },
        notes: {
          type: 'string',
          description: 'Optional notes related to the attendance record.',
          example: 'Late arrival.',
        },
        createdAt: {
          type: 'string',
          format: 'date-time',
          description: 'The timestamp when the attendance record was created.',
          example: '2023-11-20T10:30:00Z',
        },
        updatedAt: {
          type: 'string',
          format: 'date-time',
          description: 'The timestamp when the attendance record was last updated.',
          example: '2023-11-20T11:00:00Z',
        },
      },
    },
  };