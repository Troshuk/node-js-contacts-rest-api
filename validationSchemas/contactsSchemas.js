import Joi from "joi";
import { isValidObjectId } from "mongoose";

const joiObjectId = (id, { message }) =>
  isValidObjectId(id)
    ? id
    : message(`This is not a valid resource ID: [${id}]`);

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email({}).required(),
  phone: Joi.string().regex(/^[0-9]{10}$/),
  favorite: Joi.boolean(),
  type: Joi.string().custom(joiObjectId).required(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(30),
  email: Joi.string().email({}),
  phone: Joi.string().regex(/^[0-9]{10}$/),
  favorite: Joi.boolean(),
  type: Joi.string().custom(joiObjectId),
});

export const updateContactStatusSchema = Joi.object({
  favorite: Joi.boolean().required(),
});
