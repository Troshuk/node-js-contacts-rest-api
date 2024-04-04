import { StatusCodes } from 'http-status-codes';

import catchErrors from '../decorators/catchErrors.js';
import HttpError from '../helpers/HttpError.js';
import userService from '../services/modelServices/UserService.js';
import { transformUser } from '../transformers/userTransformer.js';
import contactService from '../services/modelServices/ContactService.js';
import contactTypeService from '../services/modelServices/ContactTypeService.js';
import cloudinaryService from '../services/thirdPartyServices/cloudinaryService.js';
import fileService from '../services/fileService.js';
import smtpEmailService from '../services/thirdPartyServices/emailServices/smtpEmailService.js';
import cryptoService from '../services/cryptoService.js';

const getId = (req) => req.params.id;
const getUserId = (req) => req.user._id;

export const createUser = catchErrors(async ({ body }, res) => {
  const token = await userService.createUserWithToken(body);
  await smtpEmailService.sendEmailVerification(body.email, token);

  res.status(StatusCodes.CREATED).json({
    message: 'User has been created and email verification has been sent',
  });
});

export const resendVerifiation = catchErrors(async ({ body }, res) => {
  const { email } = body;
  const token = await userService.reCreateVerificationToken(email);
  await smtpEmailService.sendEmailVerification(email, token);

  res.status(StatusCodes.CREATED).json({
    message: 'Email verification has been sent',
  });
});

export const verifyUser = catchErrors(async (req, res) => {
  const { token } = req.params;

  if (!(await userService.verifyUserByToken(token))) {
    throw new HttpError(StatusCodes.NOT_FOUND, 'Verification token is invalid');
  }

  res.json({ message: 'Your email has been successfully verified' });
});

export const forgotPassword = catchErrors(async ({ body: { email } }, res) => {
  const token = await userService.createPasswordResetToken(email);
  await smtpEmailService.sendPasswordReset(email, token);

  res.json({ message: 'Password reset was sent via email' });
});

export const updatePassword = catchErrors(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!(await userService.resetPasswordByToken(token, password))) {
    throw new HttpError(StatusCodes.BAD_REQUEST, 'Reset token is invalid');
  }

  res.json({ message: 'Password has been successfully reset' });
});

export const authenticateUser = catchErrors(async (req, res) => {
  const { email, password } = req.body;
  const user = await userService.authenticateUser(email, password);

  res.json({ user: transformUser(user), token: user.token });
});

export const removeToken = catchErrors(async (req, res) => {
  await userService.removeToken(getUserId(req));

  res.status(StatusCodes.NO_CONTENT).send();
});

export const getCurrentUser = catchErrors(({ user }, res) => {
  res.json(transformUser(user));
});

export const updateUserSubscription = catchErrors(async (req, res) => {
  const { subscription } = req.body;
  const user = await userService.updateOrFail(getUserId(req), { subscription });

  res.json(transformUser(user));
});

export const updateUserAvatar = catchErrors(async (req, res) => {
  const { path } = req.file;

  await fileService.imageResize(path);

  const avatarURL = await cloudinaryService.upload(path, 'users/avatars');

  await fileService.removeFile(path);

  const user = await userService.updateOrFail(getUserId(req), { avatarURL });

  res.json(transformUser(user));
});

// Admin guarded endpoints

export const getAllUsers = catchErrors(async (req, res) => {
  const { offset: skip = 0, limit = 10 } = req.query;

  res.json(await userService.getAll({}, { skip, limit }));
});

export const getUserById = catchErrors(async (req, res) => {
  res.json(await userService.findByIdOrFail(getId(req)));
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

  res.json(await userService.updateOrFail(userId, req.body));
});

export const deleteUserById = catchErrors(async (req, res) => {
  const owner = getId(req);
  const user = await userService.deleteByIdOrFail(getId(req));

  // Delete all the relatinoships
  const contacts = await contactService.deleteAll({ owner });
  const contactTypes = await contactTypeService.deleteAll({ owner });

  res.json({
    user,
    deletedContactsCount: contacts.deletedCount,
    deletedContactTypesCount: contactTypes.deletedCount,
  });
});

export const createChat = catchErrors(async (req, res) => {
  const { email, token } = req.user;
  const room = cryptoService.generateToken();

  await smtpEmailService.sendJoinChatLink(email, email, room, token);

  res.json({
    message: 'Email to join this chat has been sent to your email address',
    room,
  });
});

export const joinChat = catchErrors(async (req, res) => {
  const { email, token } = req.user;
  const { room } = req.params;

  await smtpEmailService.sendJoinChatLink(email, email, room, token);

  res.json({
    message: 'Email to join this chat has been sent to your email address',
    room,
  });
});
