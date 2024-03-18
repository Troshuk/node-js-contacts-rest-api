import express from "express";
import morgan from "morgan";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import { StatusCodes, getReasonPhrase } from "http-status-codes";

import contactsRouter from "./routes/contactsRouter.js";
import contactTypesRouter from "./routes/contactTypesRouter.js";
import usersRouter from "./routes/usersRouter.js";
import validateAuth from "./middlewares/validateAuth.js";

const { PORT = 3000, DB_HOST, DB_NAME, DB_USER, DB_PASSWORD } = process.env;

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

// Unauthenticated routes:
app.use("/api/users", usersRouter);

// Apply auth middleware
app.use("/api", validateAuth);

// Authenticated routes:
app.use("/api/contacts/types", contactTypesRouter);
app.use("/api/contacts", contactsRouter);

app.use((_, res) =>
  res.status(StatusCodes.NOT_FOUND).json({ message: "Route not found" })
);

app.use((req, _, res, __) => {
  const {
    status = StatusCodes.INTERNAL_SERVER_ERROR,
    message = getReasonPhrase(status),
  } = req;

  res.status(status).json({ message });
});

mongoose
  .connect(DB_HOST, { dbName: DB_NAME, user: DB_USER, pass: DB_PASSWORD })
  .then(() =>
    app.listen(PORT, () =>
      console.log(`Database connection successful on port ${PORT}`)
    )
  )
  .catch(({ message }) => {
    console.error(`Server not running. Error message: ${message}`);
    process.exit(1);
  });
