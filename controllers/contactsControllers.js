import HttpError from "../helpers/HttpError.js";
import * as contactsService from "../services/contactsServices.js";

const getId = (req) => req.params.id;

export const getAllContacts = async (_, res, next) => {
  try {
    const contacts = await contactsService.listContacts();

    res.json(contacts);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const contact = await contactsService.getContactById(getId(req));

    if (!contact) throw HttpError(404);

    res.json(contact);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const contact = await contactsService.removeContact(getId(req));

    if (!contact) throw HttpError(404);

    res.json(contact);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;

    const contact = await contactsService.addContact(name, email, phone);

    res.status(201).json(contact);
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

    res.json(contact);
  } catch (error) {
    next(error);
  }
};
