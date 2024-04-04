import express from 'express';

import { validateBody, validateId } from '../middlewares/validateRequest.js';
import {
  createContactType,
  deleteContactType,
  getAllContactTypes,
  getOneContactType,
  updateContactType,
} from '../controllers/contactTypeControllers.js';
import { contactTypeSchema } from '../validationSchemas/contactTypeSchemas.js';

const router = express.Router();
router.param('id', validateId);

router
  .route('/')
  .get(getAllContactTypes)
  .post(validateBody(contactTypeSchema), createContactType);

router
  .route('/:id')
  .get(getOneContactType)
  .delete(deleteContactType)
  .put(validateBody(contactTypeSchema), updateContactType);

export default router;
