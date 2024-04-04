import Joi from 'joi';

const contactType = {
  name: Joi.string().min(3).max(30).required(),
};

export const contactTypeSchema = Joi.object(contactType);
