import Joi from "joi";

export const sliderSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  subtitle: Joi.string().allow(""),
  mediaUrl: Joi.string().uri().required(),
  mediaType: Joi.string().valid("image", "video"),
  buttonText: Joi.string().max(20),
  buttonLink: Joi.string().uri().allow(""),
  order: Joi.number().integer(),
  isActive: Joi.boolean(),
});