// validators/group.js
const Joi = require("joi");

const groupSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.base": "Name must be a string",
    "any.required": "Name is required",
    "string.empty": "Name cannot be empty",
  }),
  wardId: Joi.string()
    .required()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      "string.base": "Ward ID must be a string",
      "any.required": "Ward ID is required",
      "string.empty": "Ward ID cannot be empty",
      "string.pattern.base": "Invalid Ward ID format",
    }),
  start_date: Joi.date().iso().required().messages({
    "date.base": "Start date must be a valid date",
    "date.iso": "Start date must be in ISO format (YYYY-MM-DD)",
    "any.required": "Start date is required",
  }),
  end_date: Joi.date().iso().required().messages({
    "date.base": "End date must be a valid date",
    "date.iso": "End date must be in ISO format (YYYY-MM-DD)",
    "any.required": "End date is required",
  }),
  schedule: Joi.string().required().messages({
    "string.base": "Schedule must be a string",
    "any.required": "Schedule is required",
    "string.empty": "Schedule cannot be empty",
  }),
  room: Joi.string().optional().messages({
    "string.base": "Room must be a string",
    "string.empty": "Room cannot be empty",
  }),
  instructorId: Joi.string()
    .required()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      "string.base": "Instructor ID must be a string",
      "any.required": "Instructor ID is required",
      "string.empty": "Instructor ID cannot be empty",
      "string.pattern.base": "Invalid Instructor ID format",
    }),
});

const groupUpdateSchema = Joi.object({
  name: Joi.string().optional().messages({
    "string.base": "Name must be a string",
    "string.empty": "Name cannot be empty",
  }),
  wardId: Joi.string()
    .optional()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      "string.base": "Ward ID must be a string",
      "string.pattern.base": "Invalid Ward ID format",
    }),
  start_date: Joi.date().iso().optional().messages({
    "date.base": "Start date must be a valid date",
    "date.iso": "Start date must be in ISO format (YYYY-MM-DD)",
  }),
  end_date: Joi.date().iso().optional().messages({
    "date.base": "End date must be a valid date",
    "date.iso": "End date must be in ISO format (YYYY-MM-DD)",
  }),
  schedule: Joi.string().optional().messages({
    "string.base": "Schedule must be a string",
    "string.empty": "Schedule cannot be empty",
  }),
  room: Joi.string().optional().messages({
    "string.base": "Room must be a string",
    "string.empty": "Room cannot be empty",
  }),
  instructorId: Joi.string()
    .optional()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      "string.base": "Instructor ID must be a string",
      "string.pattern.base": "Invalid Instructor ID format",
    }),
})
  .or(
    "name",
    "wardId",
    "start_date",
    "end_date",
    "schedule",
    "room",
    "instructorId"
  )
  .messages({
    "object.missing":
      "At least one of name, wardId, start_date, end_date, schedule, room, or instructorId is required",
  });

module.exports = {
  groupSchema,
  groupUpdateSchema,
};
