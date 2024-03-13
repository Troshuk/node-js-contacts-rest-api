import { model } from "mongoose";
import BaseSchema from "./BaseSchema.js";

export default model(
  "contact_type",
  new BaseSchema(
    {
      name: {
        type: String,
        required: true,
        unique: true,
      },
    },
    { versionKey: false }
  )
);
