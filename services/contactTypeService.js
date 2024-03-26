import ContactType from '../models/ContactType.js';

const fields = '-owner';

const getAll = (filter) => ContactType.find(filter, fields);

const getById = (id) => ContactType.findById(id, fields);
const getOne = (filter) => ContactType.findOne(filter, fields);
const checkIfExists = (filter) => ContactType.exists(filter);

const create = (data) => ContactType.create(data);

const update = (id, data) => ContactType.findByIdAndUpdate(id, data);
const updateOne = (filter, data) => ContactType.findOneAndUpdate(filter, data);

const remove = (id) => ContactType.findByIdAndDelete(id);
const removeOne = (filter) => ContactType.findOneAndDelete(filter);

const removeAll = (filter) => ContactType.deleteMany(filter);

export default {
  getAll,
  getById,
  getOne,
  checkIfExists,
  create,
  update,
  updateOne,
  remove,
  removeOne,
  removeAll,
};
