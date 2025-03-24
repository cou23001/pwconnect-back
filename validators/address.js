// validators/address.js
const Joi = require('joi');

// Address Schema
const addressSchema = Joi.object({
    street: Joi.string().required().messages({
        'any.required': 'Street is required',
    }),
    neighborhood: Joi.string().required().messages({
        'any.required': 'Neighborhood is required',
    }),
    city: Joi.string().required().messages({
        'any.required': 'City is required',
    }),
    state: Joi.string().required().messages({
        'any.required': 'State is required',
    }),
    country: Joi.string().required().messages({
        'any.required': 'Country is required',
    }),
    postalCode: Joi.string().pattern(/^\d{5}$/).required().messages({
        'string.pattern.base': 'Postal Code must be a 5-digit number',
        'any.required': 'Postal Code is required',
    }),
});

module.exports = addressSchema;