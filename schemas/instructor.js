//schemas/instructor.js
module.exports = {
    Instructor: {
        type: 'object',
        properties: {
            _id: {
                type: 'string',
                example: '5f3f9c5f6d7a0f0021e9d4b7',
            },
            userId: {
                type: 'string',
                example: '5f3f9c5f6d7a0f0021e9d4b7',
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
        required: ['userId'],
    },
};