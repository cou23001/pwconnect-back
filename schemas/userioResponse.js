module.exports = {
    UserResponse: {
        type: 'object',
        properties: {
            id: {
                type: 'string',
                format: 'ObjectId',
                description: 'The auto-generated ID of the user',
                example: '507f1f77bcf86cd799439011'
            },
            name: {
                type: 'string',
                description: 'The user\'s first name',
            },
            lastName: {
                type: 'string',
                description: 'The user\'s last name',
            },
            email: {
                type: 'string',
                format: 'email',
                description: 'The user\'s email address',
            },
        },
    },
};