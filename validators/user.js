// validators/user.js
const Joi = require('joi');

// User Schema
const userSchema = Joi.object({
    firstName: Joi.string().optional(),
    lastName: Joi.string().optional(),
    email: Joi.string().email().required().messages({
        'string.email': 'Email must be valid',
        'any.required': 'Email is required',
    }),
    password: Joi.string().min(8).required().messages({
        'string.min': 'Password must be at least 8 characters',
        'any.required': 'Password is required',
    }),
    type: Joi.number().valid(1, 10, 11).default(1).messages({
        'number.base': 'Type must be a number',
        'any.only': 'Type must be one of the following values: 1 (student), 10 (admin), 11(instructor)',
        'any.required': 'Type is required',
    }),
});

module.exports = userSchema;