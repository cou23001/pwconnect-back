// validators/student.js
const Joi = require('joi');
const userSchema = require('./user');
const addressSchema = require('./address');

const studentSchema = Joi.object({
    user: userSchema.required(),
    address: addressSchema.required(),
    birthDate: Joi.date().iso().required().messages({
        'date.base': 'Birth date must be a valid date',
        'date.iso': 'Birth date must be in ISO format (YYYY-MM-DD)',
        'any.required': 'Birth date is required',
    }),
    phone: Joi.string().pattern(/^[0-9\-+() ]{7,15}$/).required().messages({
        'string.pattern.base': 'Phone number must be valid (7-15 digits, dashes, or spaces)',
        'any.required': 'Phone is required',
    }),
    language: Joi.string().valid('Spanish', 'Portuguese', 'French').required().messages({
        'any.only': 'Language must be one of: Spanish, Portuguese or French',
        'any.required': 'Language is required',
    }),
    level: Joi.string().required().messages({
        'any.required': 'Level is required',
    }),
});

module.exports = studentSchema;
