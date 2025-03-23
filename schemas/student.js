// schemas/student.js
module.exports = {
    Student: {
        type: 'object',
        properties: {
            _id: {
                type: 'string',
                format: 'objectid',
                description: 'The auto-generated id of the student',
                example: '5f3f9c5f6d7a0f0021e9d4b7',
            },
            userId: {
                type: 'string',
                format: 'objectid',
                description: 'The id of the user associated with the student',
                example: '5f3f9c5f6d7a0f0021e9d4b7',
            },
            addressId: {
                type: 'string',
                format: 'objectid',
                description: 'The id of the address associated with the student',
                example: '5f3f9c5f6d7a0f0021e9d4b7',
            },
            birthDate: {
                type: 'string',
                format: 'date',
                description: 'The date of birth of the student',
                example: '2000-01-01',
            },
            phone: {
                type: 'string',
                description: 'The phone number of the student',
                example: '123-456-7890',
            },
            language: {
                type: 'string',
                description: 'The language spoken by the student',
                example: 'English',
            },
            level: {
                type: 'string',
                description: 'The level of the student',
                example: 'EC1',
            },
            createdAt: {
                type: 'string',
                format: 'date-time',
                description: 'The date and time when the student was created',
                example: '2020-08-20T20:00:00.000Z',
            },
            updatedAt: {
                type: 'string',
                format: 'date-time',
                description: 'The date and time when the student was last updated',
                example: '2020-08-20T20:00:00.000Z',
            },
        },
        required: ['_id','userId','addressId','birthDate','phone','language','level','createdAt','updatedAt'],

    },
};