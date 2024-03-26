import Contact from '../models/Contact.js';

const fields = '-createdAt -updatedAt -owner';

const getAll = (filter, query = {}) =>
  Contact.find(filter, fields, query).populate('type', 'name');

const getCount = (filter) => Contact.countDocuments(filter);

const getById = (id) => Contact.findById(id, fields).populate('type', 'name');
const getOne = (filter) =>
  Contact.findOne(filter, fields).populate('type', 'name');

const create = (data) => Contact.create(data);

const updateById = (id, data) => Contact.findByIdAndUpdate(id, data);
const updateOne = (filter, data) => Contact.findOneAndUpdate(filter, data);

const deleteById = (id) => Contact.findByIdAndDelete(id);
const deleteOne = (filter) => Contact.findOneAndDelete(filter);

const deleteAll = (filter) => Contact.deleteMany(filter);

export default {
  getAll,
  getById,
  getOne,
  create,
  updateById,
  updateOne,
  deleteById,
  deleteOne,
  deleteAll,
  getCount,
};
