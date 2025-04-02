// validators/stake.js
const Joi = require('joi');

// Define shared schema components
const stakeIdSchema = Joi.string().required().messages({
    'string.empty': 'Stake ID is required',
    'any.required': 'Stake ID is required',
});

const nameSchema = Joi.string().required().messages({
    'string.empty': 'Stake name is required',
    'any.required': 'Stake name is required',
});

const locationSchema = Joi.string().required().messages({
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

// Stake Query Schemas
const stakeQuerySchema = Joi.object({
    stakeId: stakeIdSchema,
});

const stakePaginationSchema = Joi.object({
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).optional(),
});

// Validation Functions
const validateStake = (data) => stakeSchema.validate(data);
const validateStakeUpdate = (data) => stakeUpdateSchema.validate(data);
const validateStakeId = (data) => stakeIdSchema.validate(data);
const validateStakeDelete = (data) => stakeQuerySchema.validate(data);
const validateStakeGet = (data) => stakeQuerySchema.validate(data);
const validateStakeGetAll = (data) => stakePaginationSchema.validate(data);
const validateStakeGetByName = (data) => nameSchema.validate(data);
const validateStakeGetByLocation = (data) => locationSchema.validate(data);

module.exports = {
    validateStake,
    validateStakeUpdate,
    validateStakeId,
    validateStakeDelete,
    validateStakeGet,
    validateStakeGetAll,
    validateStakeGetByName,
    validateStakeGetByLocation,
};
