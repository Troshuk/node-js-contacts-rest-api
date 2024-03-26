import { isValidObjectId } from 'mongoose';
import { StatusCodes } from 'http-status-codes';

import HttpError from '../helpers/HttpError.js';
import catchErrors from '../decorators/catchHttpErrors.js';

export const validateBody = (schema) =>
  catchErrors(({ body }, _, next) => {
    const { error } = schema.validate(body);

    if (error) {
      throw new HttpError(StatusCodes.BAD_REQUEST, error.message, error);
    }

    next();
  });

export const validateQuery = (schema) =>
  catchErrors(({ query }, _, next) => {
    const { error } = schema.validate(query);

    if (error) {
      throw new HttpError(StatusCodes.BAD_REQUEST, error.message, error);
    }

    next();
  });

export const validateId = catchErrors(({ params: { id } }, _, next) => {
  if (!isValidObjectId(id)) {
    throw new HttpError(
      StatusCodes.BAD_REQUEST,
      `This is not a valid resource ID: ${id}`
    );
  }

  next();
});
