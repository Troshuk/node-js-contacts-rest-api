import { model } from 'mongoose';

import BaseSchema from './BaseSchema.js';
import {
  userRoles,
  userSubscriptionTypes,
} from '../constants/userConstants.js';
import cryptoService from '../services/cryptoService.js';
import jwtService from '../services/jwtService.js';

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
      passwordResetToken: { type: String, select: false },
      passwordResetExpire: { type: Date, select: false },
      verified: {
        type: Boolean,
        default: false,
        select: false,
      },
      verificationToken: { type: String, select: false },
      verificationExpire: { type: Date, select: false },
    },
    {
      versionKey: false,
      timestamps: true,
      methods: {
        validatePassword(password) {
          return cryptoService.bCryptCompare(password, this.password);
        },
        createPasswordResetToken() {
          const resetToken = cryptoService.generateToken();
          this.passwordResetToken = cryptoService.encrypt(resetToken);
          // Expire in 10 minutes
          this.passwordResetExpire = Date.now() + 10 * (60 * 1000);
          this.save();

          return resetToken;
        },
        createVerificationToken() {
          const verificationToken = cryptoService.generateToken();
          this.verificationToken = cryptoService.encrypt(verificationToken);
          // Expire in 1 day
          this.verificationExpire = Date.now() + 24 * 60 * (60 * 1000);
          this.save();

          return verificationToken;
        },
        createAuthToken() {
          this.token = jwtService.signToken(this.id);

          this.save();

          return this.token;
        },
      },
    }
  )
    .pre('save', function preSavePassword(next) {
      if (this.isModified('password')) {
        this.password = cryptoService.bCrypt(this.password);
      }

      next();
    })
    .pre('save', function preCreateAvatar(next) {
      if (this.isNew) {
        const emailHash = cryptoService.generateMd5Hash(this.email);

        this.avatarURL = `https://www.gravatar.com/avatar/${emailHash}.jpg?d=identicon`;
      }

      next();
    })
    .pre('findOneAndUpdate', function preFindOneAndUpdatePassword(next) {
      const { password } = this.getUpdate();

      if (password) {
        this.getUpdate().password = cryptoService.bCrypt(password);
      }

      next();
    })
);
