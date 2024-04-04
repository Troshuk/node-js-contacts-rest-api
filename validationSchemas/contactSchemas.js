import Joi from 'joi';
import { isValidObjectId } from 'mongoose';

const joiObjectId = (id, { message }) => {
  if (!isValidObjectId(id)) {
    return message(`This is not a valid resource ID: [${id}]`);
  }

  return id;
};

const contact = {
  name: Joi.string().min(3).max(30),
  email: Joi.string().email({}),
  phone: Joi.string().regex(/^[0-9]{10}$/),
  favorite: Joi.boolean(),
  type: Joi.string().custom(joiObjectId),
};

export const createContactSchema = Joi.object({
  ...contact,
  name: contact.name.required(),
  email: contact.email.required(),
  type: contact.type.required(),
});

export const updateContactSchema = Joi.object(contact);

export const updateContactStatusSchema = Joi.object({
  favorite: contact.favorite.required(),
});
