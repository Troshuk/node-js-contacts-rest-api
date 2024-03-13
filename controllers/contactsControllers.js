import { StatusCodes } from "http-status-codes";

import { catchErrors } from "../decorators/ControllerError.js";
import HttpError from "../helpers/HttpError.js";
import * as contactsService from "../services/contactsServices.js";
import * as contactTypesService from "../services/contactTypesServices.js";

const getId = (req) => req.params.id;

export const getAllContacts = catchErrors(async (_, res) =>
  res.json(await contactsService.listContacts())
);

export const getOneContact = catchErrors(async (req, res) => {
  const contact = await contactsService.getContactById(getId(req));

  if (!contact) throw HttpError(StatusCodes.NOT_FOUND);

  res.json(contact);
});

export const deleteContact = catchErrors(async (req, res) => {
  const contact = await contactsService.removeContact(getId(req));

  if (!contact) throw HttpError(StatusCodes.NOT_FOUND);

  res.json(contact);
});

export const createContact = catchErrors(async ({ body }, res) => {
  if (!(await contactTypesService.checkIfExists(body.type)))
    throw HttpError(StatusCodes.NOT_FOUND, "type was not found");

  return res.status(201).json(await contactsService.addContact(body));
});

export const updateContact = catchErrors(async (req, res) => {
  const { name, email, phone, favorite, type } = req.body;

  if (!name && !email && !phone && !favorite)
    throw HttpError(
      StatusCodes.BAD_REQUEST,
      "Body must have at least one field"
    );

  if (!(await contactTypesService.checkIfExists(type)))
    throw HttpError(StatusCodes.NOT_FOUND, "type was not found");

  const contact = await contactsService.updateContact(getId(req), req.body);

  if (!contact) throw HttpError(StatusCodes.NOT_FOUND);

  res.json(contact);
});

export const updateContactStatus = catchErrors(async (req, res) => {
  const contact = await contactsService.updateContact(getId(req), req.body);

  if (!contact) throw HttpError(StatusCodes.NOT_FOUND);

  res.json(contact);
});
