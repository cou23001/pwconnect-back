// validators/instructor.js
const Joi = require('joi');
const objectIdPattern = /^[0-9a-fA-F]{24}$/;
const { instructorUserSchema, partialUserSchema } = require('./user');

const instructorSchema = Joi.object({
    user: instructorUserSchema.required(),
    wardId: Joi.string().pattern(objectIdPattern).required().messages({
        'string.pattern.base': 'Invalid ward ID format',
        'any.required': 'wardId is required',
    }),
});

const partialInstructorSchema = Joi.object({
    user: partialUserSchema.required(),
    wardId: Joi.string().pattern(objectIdPattern).messages({
        'string.pattern.base': 'Invalid ward ID format',
    }),
}).min(1).messages({
    'object.missing': 'At least one of user or wardId is required',
});

module.exports = { 
    instructorSchema,
    partialInstructorSchema,
};
