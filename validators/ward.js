const Joi = require("joi");

const wardSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.base": "Name must be a string",
    "any.required": "Name is required",
    "string.empty": "Name cannot be empty",
  }),
  location: Joi.string().required().messages({
    "string.base": "Location must be a string",
    "any.required": "Location is required",
    "string.empty": "Location cannot be empty",
  }),
  stakeId: Joi.string()
    .required()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      "string.base": "Stake ID must be a string",
      "any.required": "Stake ID is required",
      "string.empty": "Stake ID cannot be empty",
      "string.pattern.base": "Invalid Stake ID format",
    }),
});

const wardUpdateSchema = Joi.object({
  name: Joi.string().optional().messages({
    "string.base": "Name must be a string",
    "string.empty": "Name cannot be empty",
  }),
  location: Joi.string().optional().messages({
    "string.base": "Location must be a string",
    "string.empty": "Location cannot be empty",
  }),
  stakeId: Joi.string()
    .optional()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      "string.base": "Stake ID must be a string",
      "string.pattern.base": "Invalid Stake ID format",
    }),
})
  .or("name", "location", "stakeId")
  .messages({
    "object.missing": "At least one of name, location, or stakeId is required",
  });

module.exports = {
  wardSchema,
  wardUpdateSchema,
};
