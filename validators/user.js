// validators/user.js
const Joi = require('joi');

// User Schema
const userSchema = Joi.object({
    firstName: Joi.string().required().messages({
        'any.required': 'First name is required',
    }),
    lastName: Joi.string().required().messages({
        'any.required': 'Last name is required',
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'Email must be valid',
        'any.required': 'Email is required',
    }),
    password: Joi.string().min(8).required().messages({
        'string.min': 'Password must be at least 8 characters',
        'any.required': 'Password is required',
    }),
    roleId: Joi.string().optional(),
});

module.exports = userSchema;