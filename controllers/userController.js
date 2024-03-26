import { StatusCodes } from 'http-status-codes';

import catchErrors from '../decorators/catchErrors.js';
import HttpError from '../helpers/HttpError.js';
import userService from '../services/userService.js';
import { transformUser } from '../transformers/userTransformer.js';
import jwtService from '../services/jwtService.js';
import contactService from '../services/contactService.js';
import contactTypeService from '../services/contactTypeService.js';

const getId = (req) => req.params.id;
const getUserId = (req) => req.user._id;

export const createUser = catchErrors(async ({ body }, res) => {
  const { email } = body;

  if (await userService.checkIfExists({ email })) {
    throw new HttpError(StatusCodes.CONFLICT, 'Email is already in use');
  }

  let user = await userService.create(body);
  const token = jwtService.signToken(user.id);

  user = await userService.update(user.id, { token });

  res.status(StatusCodes.CREATED).json({ user: transformUser(user), token });
});

export const authenticateUser = catchErrors(async ({ body }, res) => {
  const { email, password } = body;
  let user = await userService.find({ email }, '+password');
  const { id } = user;

  if (!user || !user.validatePassword(password)) {
    throw new HttpError(StatusCodes.UNAUTHORIZED, 'Email or password is wrong');
  }

  const token = jwtService.signToken(id);

  user = await userService.update(id, { token });

  res.json({ user: transformUser(user), token });
});

export const removeToken = catchErrors(async (req, res) => {
  await userService.update(getUserId(req), { token: null });

  res.status(StatusCodes.NO_CONTENT).send();
});

export const getCurrentUser = catchErrors(({ user }, res) => {
  res.json(transformUser(user));
});

export const updateUserSubscription = catchErrors(async (req, res) => {
  const { subscription } = req.body;

  const user = await userService.update(getUserId(req), { subscription });

  if (!user) throw new HttpError(StatusCodes.NOT_FOUND);

  res.json(transformUser(user));
});

// Admin guarded endpoints

export const getAllUsers = catchErrors(async (req, res) => {
  const { offset: skip = 0, limit = 10 } = req.query;

  const users = await userService.getAll({}, { skip, limit });

  res.json(users);
});

export const getUserById = catchErrors(async (req, res) => {
  const user = await userService.findById(getId(req));

  if (!user) throw new HttpError(StatusCodes.NOT_FOUND);

  res.json(user);
});

export const updateUserById = catchErrors(async (req, res) => {
  const userId = getId(req);

  if (
    await userService.checkIfExists({
      email: req.body.email,
      _id: { $not: { $eq: userId } },
    })
  ) {
    throw new HttpError(StatusCodes.CONFLICT, 'Email is already in use');
  }

  const user = await userService.update(userId, req.body);

  if (!user) throw new HttpError(StatusCodes.NOT_FOUND);

  res.json(user);
});

export const deleteUserById = catchErrors(async (req, res) => {
  const owner = getId(req);

  const user = await userService.deleteById(getId(req));

  if (!user) throw new HttpError(StatusCodes.NOT_FOUND);

  // Delete all the relatinoships
  const contacts = await contactService.deleteAll({ owner });
  const contactTypes = await contactTypeService.removeAll({ owner });

  res.json({
    user,
    deletedContactsCount: contacts.deletedCount,
    deletedContactTypesCount: contactTypes.deletedCount,
  });
});
