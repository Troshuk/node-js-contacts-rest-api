import request from 'supertest';
import { StatusCodes } from 'http-status-codes';

import app from '../../app.js';
import { userSubscriptionTypes } from '../../constants/userConstants.js';
import UserService from '../../services/modelServices/UserService.js';

const api = request.agent(app);

const routes = { login: '/api/users/login' };

const logIn = (body) => api.post(routes.login).send(body);

const loginData = {
  email: 'qwerty@qwerty.com',
  password: 'ThisIsAValidEmail123',
};
const invalidEmail = loginData.email.split('.')[0];
const invalidPassword = '$%^&*()';
const unknownField = 'unknownField';
const subscriptionTypesRegex = new RegExp(
  `^${Object.values(userSubscriptionTypes).join('|')}$`
);

const errorMessages = {
  emailIsRequired: '"email" is required',
  emailIsInvalid: '"email" must be a valid email',
  passwordIsRequired: '"password" is required',
  unallowedField: `"${unknownField}" is not allowed`,
  wrongCreds: 'Email or password is wrong',
};

describe(`test ${routes.login}`, () => {
  beforeAll((done) => {
    app.on('appStarted', () => done());
  });

  afterEach(async () => {
    await UserService.deleteAll({});
  });

  it(`Request validation | ${errorMessages.emailIsRequired}`, async () => {
    const { statusCode, body } = await logIn({});

    expect(statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(body.message).toBe(errorMessages.emailIsRequired);
  });

  it(`Request validation | ${errorMessages.emailIsInvalid}`, async () => {
    const { statusCode, body } = await logIn({ email: invalidEmail });

    expect(statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(body.message).toBe(errorMessages.emailIsInvalid);
  });

  it(`Request validation | "email" is valid, ${errorMessages.passwordIsRequired}`, async () => {
    const { statusCode, body } = await logIn({ email: loginData.email });

    expect(statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(body.message).toBe(errorMessages.passwordIsRequired);
  });

  it('Request validation | "password" must be a valid email', async () => {
    const { statusCode, body } = await logIn({
      ...loginData,
      password: invalidPassword,
    });

    expect(statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(body.message).toContain('"password" with value');
    expect(body.message).toContain('fails to match the required pattern');
  });

  it(`Request validation | ${errorMessages.unallowedField}`, async () => {
    const { statusCode, body } = await logIn({ ...loginData, unknownField });

    expect(statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(body.message).toBe(errorMessages.unallowedField);
  });

  it(`Request validation | ${errorMessages.wrongCreds}`, async () => {
    const { statusCode, body } = await logIn(loginData);

    expect(statusCode).toBe(StatusCodes.UNAUTHORIZED);
    expect(body.message).toBe(errorMessages.wrongCreds);
  });

  it('Request validation | Login was successfull', async () => {
    await UserService.create(loginData);
    const { statusCode, body } = await logIn(loginData);

    expect(statusCode).toBe(StatusCodes.OK);
    expect(body).toEqual(
      expect.objectContaining({
        token: expect.any(String),
        user: expect.objectContaining({
          email: expect.any(String),
          subscription: expect.stringMatching(subscriptionTypesRegex),
          avatarURL: expect.any(String),
        }),
      })
    );
  });
});
