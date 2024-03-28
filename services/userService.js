import User from '../models/User.js';

const find = (filter = {}, fields = '') => User.findOne(filter, fields);

const findById = (id) => User.findById(id);

const create = (data) => User.create(data);

const update = (id, data) => User.findByIdAndUpdate(id, data);

const getAll = (filter, query = {}) => User.find(filter, '', query);

const deleteById = (id) => User.findByIdAndDelete(id);

const checkIfExists = (filter) => User.exists(filter);

const deleteAll = (filter) => User.deleteMany(filter);

export default {
  find,
  findById,
  create,
  update,
  getAll,
  deleteById,
  checkIfExists,
  deleteAll,
};
