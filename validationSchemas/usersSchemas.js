import Joi from "joi";
import {
  passwordRegex,
  userSubscriptionTypes,
} from "../constants/userConstants.js";

const emailOptions = { minDomainSegments: 2, tlds: { allow: ["com", "net"] } };

export const createUserSchema = Joi.object({
  email: Joi.string().email(emailOptions).required(),
  password: Joi.string().regex(passwordRegex).required(),
  subscription: Joi.string()
    .valid(...userSubscriptionTypes)
    .required(),
});

export const authenticateUserSchema = Joi.object({
  email: Joi.string().email(emailOptions).required(),
  password: Joi.string().regex(passwordRegex).required(),
});

export const updateUserSubscriptionSchema = Joi.object({
  subscription: Joi.string()
    .valid(...userSubscriptionTypes)
    .required(),
});
