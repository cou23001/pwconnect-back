// validators/student.js
const Joi = require('joi');
const userSchema = require('./user');
const addressSchema = require('./address');

const studentSchema = Joi.object({
    user: userSchema.required(),
    address: addressSchema.optional(),
    birthDate: Joi.date().iso().optional().messages({
        'date.base': 'Birth date must be a valid date',
        'date.iso': 'Birth date must be in ISO format (YYYY-MM-DD)',
    }),
    phone: Joi.string().pattern(/^[0-9\-+() ]{7,15}$/).optional().messages({
        'string.pattern.base': 'Phone number must be valid (7-15 digits, dashes, or spaces)',
    }),
    language: Joi.string().valid('Spanish', 'Portuguese', 'French', 'Italian').optional().messages({
        'any.only': 'Language must be one of: Spanish, Portuguese, French or Italian',
    }),
    level: Joi.string().valid('EC1', 'EC2').optional().messages({
        'any.only': 'Level must be one of: EC1 or EC2',
    }),
});

module.exports = studentSchema;
