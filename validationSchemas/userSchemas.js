import Joi from 'joi';
import {
  passwordRegex,
  userRoles,
  userSubscriptionTypes,
} from '../constants/userConstants.js';

const emailOptions = { minDomainSegments: 2, tlds: { allow: ['com', 'net'] } };

const user = {
  email: Joi.string().email(emailOptions),
  password: Joi.string().regex(passwordRegex),
  subscription: Joi.string().valid(...Object.values(userSubscriptionTypes)),
  role: Joi.string().valid(...Object.values(userRoles)),
};

export const createUserSchema = Joi.object({
  email: user.email.required(),
  password: user.password.required(),
  subscription: user.subscription.required(),
});

export const authenticateUserSchema = Joi.object({
  email: user.email.required(),
  password: user.password.required(),
});

export const updateUserSubscriptionSchema = Joi.object({
  subscription: user.subscription.required(),
});

export const updateUserSchema = Joi.object(user);
