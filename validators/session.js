// validators/session.js
const Joi = require("joi");

const updateSessionSchema = Joi.object({
  date: Joi.date().iso().required().messages({
    "date.base": "Date must be a valid date",
    "date.iso": "Date must be in ISO format (YYYY-MM-DD)",
    "any.required": "Date is required",
  }),
  topic: Joi.string().trim().optional().messages({
    "string.base": "Topic must be a string",
  }),
  completed: Joi.boolean().required().messages({
    "boolean.base": "Completed must be a boolean",
    "any.required": "Completed status is required",
  }),
  notes: Joi.string().trim().optional().messages({
    "string.base": "Notes must be a string",
  }),
});

module.exports = {
  updateSessionSchema,
};
