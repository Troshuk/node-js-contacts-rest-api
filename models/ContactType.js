import { model } from "mongoose";
import BaseSchema from "./BaseSchema.js";
import User from "./User.js";

export default model(
  "contact_type",
  new BaseSchema(
    {
      name: {
        type: String,
        required: true,
      },
      owner: {
        type: BaseSchema.Types.ObjectId,
        ref: User.modelName,
        required: [true, "Owner's ID is required"],
      },
    },
    { versionKey: false }
  )
);
