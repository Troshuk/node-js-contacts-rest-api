import HttpError from "../helpers/HttpError.js";
import * as contactsService from "../services/contactsServices.js";

const responseWithSuccess = (res, status, data) =>
  res.status(status).json({
    status,
    data,
  });

const getId = (req) => req.params.id;

export const getAllContacts = async (_, res, next) => {
  try {
    const contacts = await contactsService.listContacts();

    responseWithSuccess(res, 200, contacts);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const contact = await contactsService.getContactById(getId(req));

    if (!contact) throw HttpError(404);

    responseWithSuccess(res, 200, contact);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const contact = await contactsService.removeContact(getId(req));

    if (!contact) throw HttpError(404);

    responseWithSuccess(res, 200, contact);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;

    const contact = await contactsService.addContact(name, email, phone);

    responseWithSuccess(res, 201, contact);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;

    if (!name && !email && !phone)
      throw HttpError(400, "Body must have at least one field");

    const contact = await contactsService.updateContact(getId(req), req.body);

    if (!contact) throw HttpError(404);

    responseWithSuccess(res, 200, contact);
  } catch (error) {
    next(error);
  }
};
