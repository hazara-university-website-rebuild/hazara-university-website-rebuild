import Joi from "joi";

export const vcSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  message: Joi.string().min(50).required(), // VC messages are usually long
  image: Joi.string().uri().required(),
  designation: Joi.string(),
  isActive: Joi.boolean(),
});