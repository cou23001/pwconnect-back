// validators/address.js
const Joi = require('joi');

// Address Schema
const addressSchema = Joi.object({
    street: Joi.string().trim().required().messages({
        'any.required': 'Street is required',
        'string.empty': 'Street cannot be empty',
    }),
    neighborhood: Joi.string().trim().required().messages({
        'any.required': 'Neighborhood is required',
    }),
    city: Joi.string().trim().required().messages({
        'any.required': 'City is required',
        'string.empty': 'City cannot be empty',
    }),
    state: Joi.string().trim().required().messages({
        'any.required': 'State is required',
        'string.empty': 'State cannot be empty',
    }),
    country: Joi.string().trim().required().messages({
        'any.required': 'Country is required',
        'string.empty': 'Country cannot be empty',
    }),
    postalCode: Joi.string().trim().pattern(/^\d{5}$/).required().messages({
        'string.pattern.base': 'Postal Code must be a 5-digit number',
        'any.required': 'Postal Code is required',
        'string.empty': 'Postal Code cannot be empty',
    }),
});

// Partial Address Schema
const partialAddressSchema = Joi.object({
    street: Joi.string().trim().messages({
        'string.empty': 'Street cannot be empty',
    }),
    neighborhood: Joi.string().trim().messages({
        'string.empty': 'Neighborhood cannot be empty',
    }),
    city: Joi.string().trim().messages({
        'string.empty': 'City cannot be empty',
    }),
    state: Joi.string().trim().messages({
        'string.empty': 'State cannot be empty',
    }),
    country: Joi.string().trim().messages({
        'string.empty': 'Country cannot be empty',
    }),
    postalCode: Joi.string().trim().pattern(/^\d{5}$/).messages({
        'string.pattern.base': 'Postal Code must be a 5-digit number',
    }),
}).min(1).messages({
    'object.missing': 'At least one of the address fields is required',
});

module.exports = {
    addressSchema,
    partialAddressSchema,
};