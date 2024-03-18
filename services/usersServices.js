import User from "../models/User.js";

export const find = (filter = {}) => User.findOne(filter);

export const findById = (id) => User.findById(id);

export const create = ({ password, ...data }) => {
  const user = new User(data);
  user.setPassword(password);

  return user.save();
};

export const updateUser = (id, data) => User.findByIdAndUpdate(id, data);

export const validatePassword = (user, password) =>
  user.validatePassword(password);
