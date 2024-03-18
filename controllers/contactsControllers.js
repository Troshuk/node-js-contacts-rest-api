import { StatusCodes } from "http-status-codes";

import { catchErrors } from "../decorators/CatchErrors.js";
import HttpError from "../helpers/HttpError.js";
import * as contactsService from "../services/contactsServices.js";
import * as contactTypesService from "../services/contactTypesServices.js";
import { transformContact } from "../transformers/contactTransformer.js";

const getId = (req) => req.params.id;
const getUserId = (req) => req.user._id;

export const getAllContacts = catchErrors(async (req, res) => {
  const { offset: skip = 0, limit = 10, favorite } = req.query;
  const filter = { owner: getUserId(req) };

  if (favorite !== undefined) {
    filter.favorite = favorite;
  }

  const contacts = await contactsService.getAllContacts(filter, {
    skip,
    limit,
  });

  res.json(contacts.map(transformContact));
});

export const getOneContact = catchErrors(async (req, res) => {
  const contact = await contactsService.getOneContact({
    _id: getId(req),
    owner: getUserId(req),
  });

  if (!contact) throw HttpError(StatusCodes.NOT_FOUND);

  res.json(transformContact(contact));
});

export const createContact = catchErrors(async ({ body, user }, res) => {
  const { _id: owner } = user;

  if (!(await contactTypesService.checkIfExists({ _id: body.type, owner })))
    throw HttpError(StatusCodes.NOT_FOUND, "Type was not found");

  const contact = await contactsService.createContact({ ...body, owner });

  return res.status(StatusCodes.CREATED).json(transformContact(contact));
});

export const updateContact = catchErrors(async (req, res) => {
  const { name, email, phone, favorite, type } = req.body;
  const owner = getUserId(req);

  if (!name && !email && !phone && typeof favorite !== undefined && !type)
    throw HttpError(
      StatusCodes.BAD_REQUEST,
      "Body must have at least one field"
    );

  if (!(await contactTypesService.checkIfExists({ _id: type, owner })))
    throw HttpError(StatusCodes.NOT_FOUND, "Type was not found");

  const contact = await contactsService.updateOneContact(
    { _id: getId(req), owner },
    req.body
  );

  if (!contact) throw HttpError(StatusCodes.NOT_FOUND);

  res.json(transformContact(contact));
});

export const updateContactStatus = catchErrors(async (req, res) => {
  const contact = await contactsService.updateContactById(
    { _id: getId(req), owner: getUserId(req) },
    req.body
  );

  if (!contact) throw HttpError(StatusCodes.NOT_FOUND);

  res.json(transformContact(contact));
});

export const deleteContact = catchErrors(async (req, res) => {
  const contact = await contactsService.deleteOneContact({
    _id: getId(req),
    owner: getUserId(req),
  });

  if (!contact) throw HttpError(StatusCodes.NOT_FOUND);

  res.json(transformContact(contact));
});
