// validators/partialStudent.js
const Joi = require('joi');

const partialStudentSchema = Joi.object({
    user: Joi.object({
        firstName: Joi.string().messages({
            'string.empty': 'First name must be a valid string',
        }),
        lastName: Joi.string().messages({
            'string.empty': 'Last name must be a valid string',
        }),
        email: Joi.string().email().messages({
            'string.email': 'Email must be a valid email address',
        }),
        password: Joi.string().min(8).messages({
            'string.min': 'Password must be at least 8 characters',
        }),
        type: Joi.forbidden().messages({
            'any.unknown': 'Type cannot be modified',
        }),
        avatar: Joi.string().messages({
            'string.base': 'Avatar must be a string',
        }),
    }),
    address: Joi.object({
        street: Joi.string().messages({
            'string.empty': 'Street is required',
        }),
        neighborhood: Joi.string().messages({
            'string.empty': 'Neighborhood is required',
        }),
        city: Joi.string().messages({
            'string.empty': 'City is required',
        }),
        state: Joi.string().messages({
            'string.empty': 'State is required',
        }),
        country: Joi.string().messages({
            'string.empty': 'Country is required',
        }),
        postalCode: Joi.string().pattern(/^\d{5}$/).messages({
            'string.pattern.base': 'Zip Code must be a 5-digit number',
        }),
    }),
    birthDate: Joi.date().iso().messages({
        'date.base': 'Birth date must be a valid date',
        'date.iso': 'Birth date must be in ISO format (YYYY-MM-DD)',
    }),
    phone: Joi.string().pattern(/^[0-9\-+() ]{7,15}$/).messages({
        'string.pattern.base': 'Phone number must be valid (7-15 digits, dashes, or spaces)',
    }),
    language: Joi.string().valid('Spanish', 'Portuguese', 'French', 'Italian').messages({
        'any.only': 'Language must be one of: Spanish, Portuguese, French or Italian',
    }),
    level: Joi.string().valid('EC1', 'EC2').messages({
        'any.only': 'Level must be one of: EC1 or EC2',
    }),
}).min(1); // Ensure at least one field is provided

module.exports = partialStudentSchema;