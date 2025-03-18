// schemas/ward.js
module.exports = {
    Ward: {
        type: 'object',
        properties: {
        id: {
            type: 'string',
            format: 'ObjectId',
            description: 'The auto generated ID of the ward',
            example: '507f1f77bcf86cd799439011',
        },
        name: {
            type: 'string',
            description: 'The ward\'s name',
            example: 'ward 1',
        },
        location: {
            type: 'string',
            description: 'The ward\'s location',
            example: 'Lagos',
        },
        stakeId: {
            type: 'string',
            format: 'ObjectId',
            description: 'The ID of the stake the ward belongs to',
            example: '507f1f77bcf86cd799439011',
        },
        createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'The timestamp when the ward was created',
            example: '2023-10-15T12:00:00Z',
        },
        updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'The timestamp when the ward was last updated',
            example: '2023-10-15T12:00:00Z',
        },
        },
    },
};