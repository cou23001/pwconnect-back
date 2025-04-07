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
    phone: Joi.string().pattern(/^[0-9\-+() ]{7,15}$/).optional().messages({
            'string.pattern.base': 'Phone number must be valid (7-15 digits, dashes, or spaces)',
    }),
    // add a default url value for avatar
    avatar: Joi.string().default('https://example.com/default-avatar.png').messages({
        'string.base': 'Avatar must be a string',
    }),
});

// User Schema for partial updates
const partialUserSchema = Joi.object({
    firstName: Joi.string().optional(),
    lastName: Joi.string().optional(),
    email: Joi.string().email().optional().messages({
        'string.email': 'Email must be valid',
        'any.required': 'Email is required',
    }),
    password: Joi.string().min(8).optional().messages({
        'string.min': 'Password must be at least 8 characters',
        'any.required': 'Password is required',
    }),
    type: Joi.number().valid(1, 10, 11).default(1).messages({
        'number.base': 'Type must be a number',
        'any.only': 'Type must be one of the following values: 1 (student), 10 (admin), 11(instructor)',
        'any.required': 'Type is required',
    }),
    phone: Joi.string().pattern(/^[0-9\-+() ]{7,15}$/).optional().messages({
            'string.pattern.base': 'Phone number must be valid (7-15 digits, dashes, or spaces)',
    }),
    // add a default url value for avatar
    avatar: Joi.string().default('https://example.com/default-avatar.png').messages({
        'string.base': 'Avatar must be a string',
    }),
});

// Schema for creating an instructor that needs user data
const instructorUserSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required().messages({
        'string.email': 'Email must be valid',
        'any.required': 'Email is required',
    }),
    password: Joi.string().min(8).required().messages({
        'string.min': 'Password must be at least 8 characters',
        'any.required': 'Password is required',
    }),
    type: Joi.number().valid(1, 10, 11).default(11).messages({
        'number.base': 'Type must be a number',
        'any.only': 'Type must be one of the following values: 1 (student), 10 (admin), 11(instructor)',
        'any.required': 'Type is required',
    }),
    phone: Joi.string().pattern(/^[0-9\-+() ]{7,15}$/).required().messages({
            'string.pattern.base': 'Phone number must be valid (7-15 digits, dashes, or spaces)',
    }),
    // add a default url value for avatar
    avatar: Joi.string().default('https://example.com/default-avatar.png').messages({
        'string.base': 'Avatar must be a string',
    }),
});

module.exports = {
    userSchema,
    partialUserSchema,
    instructorUserSchema,
};