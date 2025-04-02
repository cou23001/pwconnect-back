const Joi = require('joi');

// Define a MongoDB ObjectId pattern (24 hex characters)
const objectIdPattern = /^[0-9a-fA-F]{24}$/;

const stakeIdSchema = Joi.string()
    .regex(objectIdPattern)
    .required()
    .messages({
        'string.empty': 'Stake ID is required',
        'any.required': 'Stake ID is required',
        'string.pattern.base': 'Invalid Stake ID format',
    });

const nameSchema = Joi.string()
    .required()
    .messages({
        'string.empty': 'Stake name is required',
        'any.required': 'Stake name is required',
    });

const locationSchema = Joi.string()
    .required()
    .messages({
        'string.empty': 'Stake location is required',
        'any.required': 'Stake location is required',
    });

// Main Stake Schema
const stakeSchema = Joi.object({
    name: nameSchema,
    location: locationSchema,
});

// Stake Update Schema (At least one field required)
const stakeUpdateSchema = Joi.object({
    name: Joi.string().optional(),
    location: Joi.string().optional(),
}).or('name', 'location').messages({
    'object.missing': 'At least one of name or location is required',
});

// Stake Query & Pagination Schemas
const stakeQuerySchema = Joi.object({ stakeId: stakeIdSchema });
const stakePaginationSchema = Joi.object({
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).optional(),
});

// Exported Validation Functions
module.exports = {
    validateStake: (data) => stakeSchema.validate(data),
    validateStakeUpdate: (data) => stakeUpdateSchema.validate(data),
    validateStakeId: (data) => stakeIdSchema.validate(data),
    validateStakeDelete: (data) => stakeQuerySchema.validate(data),
    validateStakeGet: (data) => stakeQuerySchema.validate(data),
    validateStakeGetAll: (data) => stakePaginationSchema.validate(data),
    validateStakeGetByName: (data) => nameSchema.validate(data),
    validateStakeGetByLocation: (data) => locationSchema.validate(data),
};
