// validators/user.js
const Joi = require('joi');
const mongoose = require('mongoose');
// Load environment variables
const dotenv = require('dotenv');
dotenv.config();
const defaultAvatarUrl = process.env.DEFAULT_AVATAR_URL;


// User Schema
const userSchema = Joi.object({
    firstName: Joi.string().trim().optional(),
    lastName: Joi.string().trim().optional(),
    email: Joi.string().email().trim().required().messages({
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
    avatar: Joi.string().uri().default(defaultAvatarUrl).messages({
        'string.base': 'Avatar must be a string',
        'string.uri': 'Avatar must be a valid URL',
    }),
});

// User Schema for partial updates
const partialUserSchema = Joi.object({
    firstName: Joi.string().trim().optional(),
    lastName: Joi.string().trim().optional(),
    email: Joi.string().email().trim().optional().messages({
        'string.email': 'Email must be valid',
    }),
    currentPassword: Joi.string().min(8).optional().messages({
        'string.min': 'Current password must be at least 8 characters',
    }),
    newPassword: Joi.string().min(8).optional().messages({
        'string.min': 'New password must be at least 8 characters',
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
    avatar: Joi.string().uri().default(defaultAvatarUrl).messages({
        'string.base': 'Avatar must be a string',
        'string.uri': 'Avatar must be a valid URL',
    }),
});

module.exports = {
    userSchema,
    partialUserSchema,
};