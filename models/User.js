import { model } from 'mongoose';
import bcrypt from 'bcrypt';

import BaseSchema from './BaseSchema.js';
import {
  passwordRegex,
  userRoles,
  userSubscriptionTypes,
} from '../constants/userConstants.js';
import { preFindOneAndUpdatePassword, preSavePassword } from './hooks.js';

export default model(
  'user',
  new BaseSchema(
    {
      email: {
        type: String,
        unique: true,
        required: [true, 'Email is required'],
      },
      password: {
        type: String,
        match: passwordRegex,
        required: [true, 'Password is required'],
        select: false,
      },
      subscription: {
        type: String,
        enum: Object.values(userSubscriptionTypes),
        default: userSubscriptionTypes.STARTER,
      },
      token: {
        type: String,
        default: null,
      },
      role: {
        type: String,
        enum: Object.values(userRoles),
        default: userRoles.USER,
      },
    },
    {
      versionKey: false,
      timestamps: true,
      methods: {
        validatePassword(password) {
          return bcrypt.compareSync(password, this.password);
        },
      },
    }
  )
    .pre('save', preSavePassword)
    .pre('findOneAndUpdate', preFindOneAndUpdatePassword)
);
