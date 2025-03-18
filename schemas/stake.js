// schemas/stake.js

module.exports = {
    Stake: {
        type: 'object',
        properties: {
            id: {
                type: 'string',
                format: 'ObjectId',
                description: 'The auto generated ID of the stake',
                example: '507f1f77bcf86cd799439011',
            },
            name: {
                type: 'string',
                description: 'The stake\'s name',
                example: 'Stake SLC 03',
            },
            location: {
                type: 'string',
                description: 'The stake\'s location',
                example: 'Salt Lake City, Utah',
            },
            createdAt: {
                type: 'string',
                format: 'date-time',
                description: 'The timestamp when the stake was created',
                example: '2023-10-15T12:00:00Z',
            },
            updatedAt: {
                type: 'string',
                format: 'date-time',
                description: 'The timestamp when the stake was last updated',
                example: '2023-10-15T12:00:00Z',
            },
        },
    },
};

