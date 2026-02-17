import Joi from "joi";

export const highlightSchema = Joi.object({
  text: Joi.string().min(5).max(100).required(),
  link: Joi.string().uri().required(),
  order: Joi.number().integer(),
  isActive: Joi.boolean(),
});