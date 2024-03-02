import { catchErrors } from "../decorators/ControllerError.js";
import HttpError from "../helpers/HttpError.js";
import * as contactsService from "../services/contactsServices.js";

const getId = (req) => req.params.id;

export const getAllContacts = catchErrors(async (_, res) =>
  res.json(await contactsService.listContacts())
);

export const getOneContact = catchErrors(async (req, res) => {
  const contact = await contactsService.getContactById(getId(req));

  if (!contact) throw HttpError(404);

  res.json(contact);
});

export const deleteContact = catchErrors(async (req, res) => {
  const contact = await contactsService.removeContact(getId(req));

  if (!contact) throw HttpError(404);

  res.json(contact);
});

export const createContact = catchErrors(
  async ({ body: { name, email, phone } }, res) =>
    res.status(201).json(await contactsService.addContact(name, email, phone))
);

export const updateContact = catchErrors(async (req, res) => {
  const { name, email, phone } = req.body;

  if (!name && !email && !phone)
    throw HttpError(400, "Body must have at least one field");

  const contact = await contactsService.updateContact(getId(req), req.body);

  if (!contact) throw HttpError(404);

  res.json(contact);
});
