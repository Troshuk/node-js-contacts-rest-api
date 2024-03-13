import ContactType from "../models/ContactType.js";

export const listContactTypes = () => ContactType.find();

export const getContactTypeById = (id) => ContactType.findById(id);

export const removeContactType = (id) => ContactType.findByIdAndDelete(id);

export const addContactType = (data) => ContactType.create(data);

export const updateContactType = (id, data) =>
  ContactType.findByIdAndUpdate(id, data);

export const checkIfExists = (_id) => ContactType.exists({ _id });
