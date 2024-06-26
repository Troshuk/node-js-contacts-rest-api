import express from 'express';

import {
  createContact,
  deleteContact,
  getAllContacts,
  getOneContact,
  updateContact,
  updateContactStatus,
} from '../controllers/contactControllers.js';
import { validateBody, validateId } from '../middlewares/validateRequest.js';
import {
  createContactSchema,
  updateContactSchema,
  updateContactStatusSchema,
} from '../validationSchemas/contactSchemas.js';

const router = express.Router();

router
  .route('/')
  .get(getAllContacts)
  .post(validateBody(createContactSchema), createContact);

router.use('/:id', validateId);

router
  .route('/:id')
  .get(getOneContact)
  .delete(deleteContact)
  .put(validateBody(updateContactSchema), updateContact);

router.patch(
  '/:id/favorite',
  validateId,
  validateBody(updateContactStatusSchema),
  updateContactStatus
);

export default router;
