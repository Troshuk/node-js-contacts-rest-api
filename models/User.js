import { model } from "mongoose";
import bcrypt from "bcrypt";

import BaseSchema from "./BaseSchema.js";
import {
  passwordRegex,
  userSubscriptionTypes,
} from "../constants/userConstants.js";

export default model(
  "user",
  new BaseSchema(
    {
      email: {
        type: String,
        unique: true,
        required: [true, "Email is required"],
      },
      password: {
        type: String,
        match: passwordRegex,
        required: [true, "Password is required"],
      },
      subscription: {
        type: String,
        enum: userSubscriptionTypes,
        default: userSubscriptionTypes[0],
      },
      token: {
        type: String,
        default: null,
      },
    },
    {
      versionKey: false,
      timestamps: true,
      methods: {
        setPassword(password) {
          this.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
        },
        validatePassword(password) {
          return bcrypt.compareSync(password, this.password);
        },
      },
    }
  )
);
