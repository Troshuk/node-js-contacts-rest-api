import Joi from "joi";

export const contactTypeSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
});
