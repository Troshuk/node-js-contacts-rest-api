import { StatusCodes } from 'http-status-codes';

import catchErrors from '../decorators/catchHttpErrors.js';
import HttpError from '../helpers/HttpError.js';
import contactService from '../services/contactService.js';
import contactTypeService from '../services/contactTypeService.js';
import { transformContact } from '../transformers/contactTransformer.js';
import { orderTypes } from '../constants/queryConstants.js';

const getId = (req) => req.params.id;

export const getAllContacts = catchErrors(async ({ query, user }, res) => {
  const {
    offset: skip = 0,
    limit = 10,
    sortBy = 'name',
    order,
    favorite,
    search,
  } = query;
  const filter = { owner: user };
  let sort = sortBy;

  if (favorite !== undefined) filter.favorite = favorite;

  if (search) {
    filter.$or = ['name', 'email', 'phone'].map((field) => ({
      [field]: { $regex: search, $options: 'i' },
    }));
  }

  if (sort && order === orderTypes.DESC) sort = `-${sort}`;

  const contacts = await contactService.getAll(filter, { skip, limit, sort });

  res.json({
    data: contacts.map(transformContact),
    total: await contactService.getCount(),
    limit,
    offset: skip,
  });
});

export const getOneContact = catchErrors(async (req, res) => {
  const contact = await contactService.getOne({
    _id: getId(req),
    owner: req.user,
  });

  if (!contact) throw new HttpError(StatusCodes.NOT_FOUND);

  res.json(transformContact(contact));
});

export const createContact = catchErrors(async ({ body, user: owner }, res) => {
  if (!(await contactTypeService.checkIfExists({ _id: body.type, owner }))) {
    throw new HttpError(StatusCodes.NOT_FOUND, 'Type was not found');
  }

  const contact = await contactService.create({ ...body, owner });

  return res.status(StatusCodes.CREATED).json(transformContact(contact));
});

export const updateContact = catchErrors(async (req, res) => {
  // eslint-disable-next-line object-curly-newline
  const { name, email, phone, favorite, type } = req;

  const owner = req.user;

  if (!name && !email && !phone && !(favorite in req.body) && !type) {
    throw new HttpError(
      StatusCodes.BAD_REQUEST,
      'Body must have at least one field'
    );
  }

  if (!(await contactTypeService.checkIfExists({ _id: type, owner }))) {
    throw new HttpError(StatusCodes.NOT_FOUND, 'Type was not found');
  }

  const contact = await contactService.updateOne(
    { _id: getId(req), owner },
    req.body
  );

  if (!contact) throw new HttpError(StatusCodes.NOT_FOUND);

  res.json(transformContact(contact));
});

export const updateContactStatus = catchErrors(async (req, res) => {
  const contact = await contactService.updateById(
    { _id: getId(req), owner: req.user },
    req.body
  );

  if (!contact) throw new HttpError(StatusCodes.NOT_FOUND);

  res.json(transformContact(contact));
});

export const deleteContact = catchErrors(async (req, res) => {
  const contact = await contactService.deleteOne({
    _id: getId(req),
    owner: req.user,
  });

  if (!contact) throw new HttpError(StatusCodes.NOT_FOUND);

  res.json(transformContact(contact));
});
