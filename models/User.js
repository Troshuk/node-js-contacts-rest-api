import { model } from 'mongoose';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

import BaseSchema from './BaseSchema.js';
import {
  passwordRegex,
  userRoles,
  userSubscriptionTypes,
} from '../constants/userConstants.js';
import {
  preCreateAvatar,
  preFindOneAndUpdatePassword,
  preSavePassword,
} from './hooks.js';
import { hashResetToken } from '../helpers/index.js';

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
      avatarURL: String,
      passwordResetToken: String,
      passwordResetExpire: Date,
    },
    {
      versionKey: false,
      timestamps: true,
      methods: {
        validatePassword(password) {
          return bcrypt.compareSync(password, this.password);
        },
        createPasswordResetToken() {
          const resetToken = crypto.randomBytes(32).toString('hex');

          this.passwordResetToken = hashResetToken(resetToken);

          // Expire in 10 minutes
          this.passwordResetExpire = Date.now() + 10 * (60 * 1000);

          this.save();

          return resetToken;
        },
      },
    }
  )
    .pre('save', preSavePassword)
    .pre('save', preCreateAvatar)
    .pre('findOneAndUpdate', preFindOneAndUpdatePassword)
);
