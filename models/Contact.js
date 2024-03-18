import { model } from "mongoose";
import BaseSchema from "./BaseSchema.js";
import ContactType from "./ContactType.js";
import User from "./User.js";

export default model(
  "contact",
  new BaseSchema(
    {
      name: {
        type: String,
        required: [true, "Contact's name is required"],
      },
      email: {
        type: String,
      },
      phone: {
        type: String,
        unique: true,
      },
      favorite: {
        type: Boolean,
        default: false,
      },
      type: {
        type: BaseSchema.Types.ObjectId,
        ref: ContactType.modelName,
        required: [true, "Contact's Type ID is required"],
      },
      owner: {
        type: BaseSchema.Types.ObjectId,
        ref: User.modelName,
        required: [true, "Owner's ID is required"],
      },
    },
    { versionKey: false, timestamps: true }
  )
);
