import express from "express";

import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateContactStatus,
} from "../controllers/contactsControllers.js";
import { validateBody, validateId } from "../middlewares/validateRequest.js";
import {
  createContactSchema,
  updateContactSchema,
  updateContactStatusSchema,
} from "../validationSchemas/contactsSchemas.js";

const contactsRouter = express.Router();

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", validateId, getOneContact);

contactsRouter.delete("/:id", validateId, deleteContact);

contactsRouter.post("/", validateBody(createContactSchema), createContact);

contactsRouter.put(
  "/:id",
  validateId,
  validateBody(updateContactSchema),
  updateContact
);

contactsRouter.patch(
  "/:id/favorite",
  validateId,
  validateBody(updateContactStatusSchema),
  updateContactStatus
);

export default contactsRouter;
