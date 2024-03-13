import express from "express";

import { validateBody, validateId } from "../decorators/validateRequest.js";
import {
  createContactType,
  deleteContactType,
  getAllContactTypes,
  getOneContactType,
  updateContactType,
} from "../controllers/contactTypesControllers.js";
import { contactTypeSchema } from "../schemas/contactTypesSchemas.js";

const contactTypesRouter = express.Router();

contactTypesRouter.get("/", getAllContactTypes);

contactTypesRouter.get("/:id", validateId, getOneContactType);

contactTypesRouter.delete("/:id", validateId, deleteContactType);

contactTypesRouter.post(
  "/",
  validateBody(contactTypeSchema),
  createContactType
);

contactTypesRouter.put(
  "/:id",
  validateId,
  validateBody(contactTypeSchema),
  updateContactType
);

export default contactTypesRouter;
