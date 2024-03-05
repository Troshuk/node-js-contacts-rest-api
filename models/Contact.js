import { Schema, model } from "mongoose";

export default model(
  "contact",
  new Schema(
    {
      name: {
        type: String,
        required: [true, "Set name for contact"],
      },
      email: String,
      phone: String,
      favorite: {
        type: Boolean,
        default: false,
      },
    },
    { versionKey: false }
  )
);
