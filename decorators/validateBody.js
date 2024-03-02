import HttpError from "../helpers/HttpError.js";

const validateBody = (schema) => {
  return ({ body }, _, next) => {
    const { error } = schema.validate(body);

    if (error) return next(HttpError(400, error.message));

    next();
  };
};

export default validateBody;
