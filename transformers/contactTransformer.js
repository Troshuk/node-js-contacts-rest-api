import { transformContactType } from './contactTypeTransformer.js';

export const transformContact = ({
  _id: id,
  name,
  email,
  phone,
  favorite,
  type,
}) => ({
  id,
  name,
  email,
  phone,
  favorite,
  type: transformContactType(type),
});
