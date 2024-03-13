import Contact from "../models/Contact.js";

export const listContacts = () =>
  Contact.find({}, "-createdAt -updatedAt").populate("type");

export const getContactById = (id) =>
  Contact.findById(id).populate("type");

export const removeContact = (id) => Contact.findByIdAndDelete(id);

export const addContact = (data) => Contact.create(data);

export const updateContact = (id, data) => Contact.findByIdAndUpdate(id, data);
