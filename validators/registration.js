// validators/registration.js
const Joi = require("joi");
const student = require("../models/student");

const registrationSchema = Joi.object({
  studentId: Joi.string()
    .trim()
    .required()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      "string.base": "Registration ID must be a string",
      "any.required": "Registration ID is required",
      "string.empty": "Registration ID cannot be empty",
      "string.pattern.base": "Invalid Registration ID format",
    }),
  groupId: Joi.string()
    .trim()
    .required()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      "string.base": "Group ID must be a string",
      "any.required": "Group ID is required",
      "string.empty": "Group ID cannot be empty",
      "string.pattern.base": "Invalid Group ID format",
    }),
  date: Joi.date().iso().required().messages({
    "date.base": "Registration date must be a valid date",
    "date.iso": "Registration date must be in ISO format (YYYY-MM-DD)",
    "any.required": "Registration date is required",
  }),
  notes: Joi.string().trim().optional().messages({
    "string.base": "Notes must be a string",
    "string.empty": "Notes cannot be empty",
  }),
});

const registrationUpdateSchema = Joi.object({
  studentId: Joi.string()
    .trim()
    .optional()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      "string.base": "Registration ID must be a string",
      "string.empty": "Registration ID cannot be empty",
      "string.pattern.base": "Invalid Registration ID format",
    }),
  groupId: Joi.string()
    .trim()
    .optional()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      "string.base": "Group ID must be a string",
      "string.empty": "Group ID cannot be empty",
      "string.pattern.base": "Invalid Group ID format",
    }),
  date: Joi.date().iso().optional().messages({
    "date.base": "Registration date must be a valid date",
    "date.iso": "Registration date must be in ISO format (YYYY-MM-DD)",
  }),
  notes: Joi.string().trim().optional().messages({
    "string.base": "Notes must be a string",
    "string.empty": "Notes cannot be empty",
  }),
})
  .or("studentId", "groupId", "date", "notes")
  .messages({
    "object.missing": "At least one of studentId, groupId, date, or notes is required",
  });

// ID validation and trim input
const idValidationSchema = Joi.string()
  .trim()
  .pattern(/^[0-9a-fA-F]{24}$/)
  .messages({
    "string.base": "Registration ID must be a string",
    "any.required": "Registration ID is required",
    "string.empty": "Registration ID cannot be empty",
    "string.pattern.base": "Invalid Registration ID format",
  });

module.exports = {
  registrationSchema,
  registrationUpdateSchema,
  idValidationSchema,
};
