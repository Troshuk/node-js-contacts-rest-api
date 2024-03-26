import { defaultEnv } from '../constants/configConstants.js';

const {
  ENVIRONMENT_TYPE: ENV = defaultEnv,

  PORT = 3000,

  DB_HOST,
  DB_NAME,
  DB_USER,
  DB_PASSWORD,

  JWT_SECRET,
  JWT_EXPIRE = '1h',
} = process.env;

export default {
  ENV,
  PORT,
  DB_HOST,
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  JWT_SECRET,
  JWT_EXPIRE,
};
