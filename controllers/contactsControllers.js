import { StatusCodes } from "http-status-codes";

import { catchErrors } from "../decorators/ControllerError.js";
import HttpError from "../helpers/HttpError.js";
import * as contactsService from "../services/contactsServices.js";

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

export const createContact = catchErrors(async ({ body }, res) =>
  res.status(201).json(await contactsService.addContact(body))
);

export const updateContact = catchErrors(async (req, res) => {
  const { name, email, phone, favorite } = req.body;

  if (!name && !email && !phone && !favorite)
    throw HttpError(
      StatusCodes.BAD_REQUEST,
      "Body must have at least one field"
    );

  const contact = await contactsService.updateContact(getId(req), req.body);

  if (!contact) throw HttpError(StatusCodes.NOT_FOUND);

  res.json(contact);
});

export const updateContactStatus = catchErrors(async (req, res) => {
  const contact = await contactsService.updateContact(getId(req), req.body);

  if (!contact) throw HttpError(StatusCodes.NOT_FOUND);

  res.json(contact);
});
