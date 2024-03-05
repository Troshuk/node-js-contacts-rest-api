import Joi from "joi";

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email({}).required(),
  phone: Joi.string().regex(/^[0-9]{10}$/),
  favorite: Joi.boolean(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(30),
  email: Joi.string().email({}),
  phone: Joi.string().regex(/^[0-9]{10}$/),
  favorite: Joi.boolean(),
});

export const updateContactStatusSchema = Joi.object({
  favorite: Joi.boolean().required(),
});
