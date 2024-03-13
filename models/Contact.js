import { model } from "mongoose";
import BaseSchema from "./BaseSchema.js";
import ContactType from "./ContactType.js";

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
        unique: true,
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
        required: true,
      },
    },
    { versionKey: false, timestamps: true }
  )
);
