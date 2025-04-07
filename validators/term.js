// validators/term.js
const Joi = require("joi");

const termSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.base": "Name must be a string",
    "any.required": "Name is required",
    "string.empty": "Name cannot be empty",
  }),
  startDate: Joi.date()
    .iso()
    .required()
    .messages({
      "date.base": "Start date must be a valid date",
      "date.iso": "Start date must be in ISO format (YYYY-MM-DD)",
      "any.required": "Start date is required",
    }),
  endDate: Joi.date()
    .iso()
    .greater(Joi.ref("startDate"))
    .required()
    .messages({
      "date.base": "End date must be a valid date",
      "date.iso": "End date must be in ISO format (YYYY-MM-DD)",
      "date.greater": "End date must be greater than start date",
      "any.required": "End date is required",
    }),
});

const termUpdateSchema = Joi.object({
  name: Joi.string().optional().messages({
    "string.base": "Name must be a string",
    "string.empty": "Name cannot be empty",
  }),
  startDate: Joi.date()
    .iso()
    .optional()
    .messages({
      "date.base": "Start date must be a valid date",
      "date.iso": "Start date must be in ISO format (YYYY-MM-DD)",
    }),
  endDate: Joi.date()
    .iso()
    .greater(Joi.ref("startDate"))
    .optional()
    .messages({
      "date.base": "End date must be a valid date",
      "date.iso": "End date must be in ISO format (YYYY-MM-DD)",
      "date.greater": "End date must be greater than start date",
    }),
})
  .or("name", "location", "stakeId")
  .messages({
    "object.missing": "At least one of name, location, or stakeId is required",
  });

module.exports = {
  termSchema,
  termUpdateSchema,
};
