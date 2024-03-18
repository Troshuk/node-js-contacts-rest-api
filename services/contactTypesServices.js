import ContactType from "../models/ContactType.js";

const fields = "-owner";

export const getAllContactTypes = (filter) => ContactType.find(filter, fields);

export const getContactTypeById = (id) => ContactType.findById(id, fields);
export const getOneContactType = (filter) =>
  ContactType.findOne(filter, fields);
export const checkIfExists = (filter) => ContactType.exists(filter);

export const createContactType = (data) => ContactType.create(data);

export const updateContactType = (id, data) =>
  ContactType.findByIdAndUpdate(id, data);
export const updateOneContactType = (filter, data) =>
  ContactType.findOneAndUpdate(filter, data);

export const deleteContactType = (id) => ContactType.findByIdAndDelete(id);
export const deleteOneContactType = (filter) =>
  ContactType.findOneAndDelete(filter);
