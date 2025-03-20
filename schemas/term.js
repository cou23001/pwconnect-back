// schemas/term.js
module.exports = {
   Term: {
      type: 'object',
      properties: {
         _id: {
            type: 'string',
            example: '5f3f9c5f6d7a0f0021e9d4b7',
         },
         name: {
            type: 'string',
            example: 'Fall 2020',
         },
         startDate: {
            type: 'string',
            format: 'date',
            example: '2020-08-24',
         },
         endDate: {
            type: 'string',
            format: 'date',
            example: '2020-12-18',
         },
         createdAt: {
            type: 'string',
            format: 'date-time',
            example: '2020-08-20T20:00:00.000Z',
         },
         updatedAt: {
            type: 'string',
            format: 'date-time',
            example: '2020-08-20T20:00:00.000Z',
         },
      },
      required: ['name', 'startDate', 'endDate'],
   },
};