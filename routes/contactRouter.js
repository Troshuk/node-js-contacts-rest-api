import express from 'express';

import {
  createContact,
  deleteContact,
  getAllContacts,
  getOneContact,
  updateContact,
  updateContactStatus,
} from '../controllers/contactControllers.js';
import {
  validateBody,
  validateId,
  validateQuery,
} from '../middlewares/validateRequest.js';
import {
  createContactSchema,
  updateContactSchema,
  updateContactStatusSchema,
} from '../validationSchemas/contactSchemas.js';
import { querySchema } from '../validationSchemas/querySchemas.js';

const router = express.Router();
router.param('id', validateId);

router
  .route('/')
  .get(
    validateQuery(querySchema(['name', 'email', 'phone', 'favorite', 'type'])),
    getAllContacts
  )
  .post(validateBody(createContactSchema), createContact);

router
  .route('/:id')
  .get(getOneContact)
  .delete(deleteContact)
  .put(validateBody(updateContactSchema), updateContact);

router.patch(
  '/:id/favorite',
  validateBody(updateContactStatusSchema),
  updateContactStatus
);

export default router;
