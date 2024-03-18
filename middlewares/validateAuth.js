import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";

import HttpError from "../helpers/HttpError.js";
import * as usersServices from "../services/usersServices.js";

const { JWT_SECRET } = process.env;

export default async (req, _, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization)
      throw HttpError(StatusCodes.UNAUTHORIZED, "Not authorized");

    const [bearer, token] = authorization.split(" ");

    if (bearer !== "Bearer" || !token)
      throw HttpError(StatusCodes.UNAUTHORIZED, "Not authorized");

    const { id } = jwt.verify(token, JWT_SECRET);
    const user = await usersServices.findById(id);

    if (!user || user.token !== token)
      throw HttpError(StatusCodes.UNAUTHORIZED, "Not authorized");

    req.user = user;
    next();
  } catch ({ message, code = StatusCodes.UNAUTHORIZED }) {
    next(HttpError(code, message));
  }
};
