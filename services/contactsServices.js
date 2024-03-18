import Contact from "../models/Contact.js";

const fields = "-createdAt -updatedAt -owner";

export const getAllContacts = (filter, query = {}) =>
  Contact.find(filter, fields, query).populate("type", "name");

export const getContactById = (id) =>
  Contact.findById(id, fields).populate("type", "name");
export const getOneContact = (filter) =>
  Contact.findOne(filter, fields).populate("type", "name");

export const createContact = (data) => Contact.create(data);

export const updateContactById = (id, data) =>
  Contact.findByIdAndUpdate(id, data);
export const updateOneContact = (filter, data) =>
  Contact.findOneAndUpdate(filter, data);

export const deleteContactById = (id) => Contact.findByIdAndDelete(id);
export const deleteOneContact = (filter) => Contact.findOneAndDelete(filter);
