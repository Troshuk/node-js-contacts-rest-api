import { isValidObjectId } from "mongoose";
import { StatusCodes } from "http-status-codes";

import HttpError from "../helpers/HttpError.js";

export const validateBody = (schema) => {
  return ({ body }, _, next) => {
    const { error } = schema.validate(body);

    return next(
      error ? HttpError(StatusCodes.BAD_REQUEST, error.message) : undefined
    );
  };
};

export const validateId = ({ params: { id } }, _, next) => {
  next(
    isValidObjectId(id)
      ? undefined
      : HttpError(
          StatusCodes.BAD_REQUEST,
          `This is not a valid resource ID: ${id}`
        )
  );
};
