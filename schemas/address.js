// schemas/address.js
module.exports = {
    Address: {
        type: 'object',
        properties: {
            _id: {
                type: 'string',
                format: 'objectid',
                description: 'The auto-generated id of the address',
                example: '5f3f9c5f6d7a0f0021e9d4b7',
            },
            street: {
                type: 'string',
                description: 'The street address',
                example: '123 Main St.',
            },
            neighborhood: {
                type: 'string',
                description: 'Neighborhood or Aartment',
                example: 'Apt. 101',
            },
            city: {
                type: 'string',
                description: 'The city',
                example: 'Salt Lake City',
            },
            state: {
                type: 'string',
                description: 'The state',
                example: 'UT',
            },
            country: {
                type: 'string',
                description: 'The country',
                example: 'USA',
            },
            postalCode: {
                type: 'string',
                description: 'The postal code',
                example: '84101',
            },
            createdAt: {
                type: 'string',
                format: 'date-time',
                description: 'The date and time when the address was created',
                example: '2020-08-20T20:00:00.000Z',
            },
            updatedAt: {
                type: 'string',
                format: 'date-time',
                description: 'The date and time when the address was last updated',
                example: '2020-08-20T20:00:00.000Z',
            },
        },
        required: ['street', 'city', 'state', 'country', 'postalCode'],
    },
};