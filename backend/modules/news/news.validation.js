import Joi from "joi";

export const newsSchema = Joi.object({
  title: Joi.string().min(5).max(150).required(),
  content: Joi.string().min(10).required(),
  category: Joi.string().valid("News", "Event", "Highlight"),
  image: Joi.string().uri().optional(),
});