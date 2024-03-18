import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

import { catchErrors } from "../decorators/CatchErrors.js";
import HttpError from "../helpers/HttpError.js";
import * as usersServices from "../services/usersServices.js";
import { transformUser } from "../transformers/userTransformer.js";

const { JWT_SECRET } = process.env;
const getUserId = (req) => req.user._id;

export const createUser = catchErrors(async ({ body }, res) => {
  const { email } = body;

  if (await usersServices.find({ email }))
    throw HttpError(StatusCodes.CONFLICT, "Email is already in use");

  const user = await usersServices.create(body);

  res.status(StatusCodes.CREATED).json({ user: transformUser(user) });
});

export const authenticateUser = catchErrors(async ({ body }, res) => {
  const { email, password } = body;
  let user = await usersServices.find({ email });
  const id = user._id;

  if (!user || !usersServices.validatePassword(user, password))
    throw HttpError(StatusCodes.UNAUTHORIZED, "Email or password is wrong");

  const token = jwt.sign({ id }, JWT_SECRET, { expiresIn: "1h" });

  user = await usersServices.updateUser(id, { token });

  res.json({ token, user: transformUser(user) });
});

export const removeToken = catchErrors(async (req, res) => {
  await usersServices.updateUser(getUserId(req), { token: null });

  res.status(StatusCodes.NO_CONTENT).send();
});

export const getCurrentUser = catchErrors(async ({ user }, res) =>
  res.json(transformUser(user))
);

export const updateUserSubscription = catchErrors(async (req, res) => {
  const { subscription } = req.body;

  const user = await usersServices.updateUser(getUserId(req), { subscription });

  res.json(transformUser(user));
});
