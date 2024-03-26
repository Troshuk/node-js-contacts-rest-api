import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import 'dotenv/config.js';
import mongoose from 'mongoose';
import { StatusCodes } from 'http-status-codes';

import contactsRouter from './routes/contactRouter.js';
import contactTypesRouter from './routes/contactTypeRouter.js';
import usersRouter from './routes/userRouter.js';
import validateAuth from './middlewares/validateAuth.js';
import globalErrorHandler from './middlewares/globalErrorHandler.js';
import { envTypes } from './constants/configConstants.js';
import serverConfigs from './configs/serverConfigs.js';

const app = express();

if (serverConfigs.ENV === envTypes.DEVELOPMENT) app.use(morgan('dev'));

app.use(cors());
app.use(express.json());

// Unauthenticated routes:
app.use('/api/users', usersRouter);

// Apply auth middleware
app.use('/api', validateAuth);

// Authenticated routes:
app.use('/api/contacts/types', contactTypesRouter);
app.use('/api/contacts', contactsRouter);

app.use((_, res) => {
  res.status(StatusCodes.NOT_FOUND).json({ message: 'Route not found' });
});

app.use(globalErrorHandler);

mongoose
  .connect(serverConfigs.DB_HOST, {
    dbName: serverConfigs.DB_NAME,
    user: serverConfigs.DB_USER,
    pass: serverConfigs.DB_PASSWORD,
  })
  .then(() => {
    app.listen(serverConfigs.PORT, () => {
      // eslint-disable-next-line no-console
      console.log(
        `Database connection successful on port ${serverConfigs.PORT}`
      );
    });
  })
  .catch(({ message }) => {
    // eslint-disable-next-line no-console
    console.error(`Server not running. Error message: ${message}`);
    process.exit(1);
  });
