import { defaultEnv, envTypes } from '../constants/configConstants.js';

const {
  NODE_ENV: ENV = defaultEnv,

  PORT = 3000,

  DB_HOST,
  DB_NAME,
  DB_USER,
  DB_PASSWORD,

  TEST_DB_NAME,

  JWT_SECRET,
  JWT_EXPIRE = '1h',

  STATIC_FOLDER = 'public',
  TEMP_FOLDER = 'temp',

  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_FOLDER,
} = process.env;

const DB = {
  DB_HOST,
  DB_NAME: ENV === envTypes.TEST ? TEST_DB_NAME : DB_NAME,
  DB_USER,
  DB_PASSWORD,
};

export default {
  APP: {
    ENV,
    PORT,
  },
  DB,
  TEST_DB: {
    DB_HOST,
    DB_NAME: TEST_DB_NAME,
    DB_USER,
    DB_PASSWORD,
  },
  JWT: {
    JWT_SECRET,
    JWT_EXPIRE,
  },
  FILE: {
    STATIC_FOLDER,
    TEMP_FOLDER,
  },
  CLOUDINARY: {
    CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET,
    CLOUDINARY_FOLDER,
  },
};
