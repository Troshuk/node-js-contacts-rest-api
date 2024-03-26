import express from 'express';

import { validateBody, validateId } from '../middlewares/validateRequest.js';
import {
  authenticateUserSchema,
  createUserSchema,
  updateUserSchema,
  updateUserSubscriptionSchema,
} from '../validationSchemas/userSchemas.js';
import {
  authenticateUser,
  createUser,
  deleteUserById,
  getAllUsers,
  getCurrentUser,
  getUserById,
  removeToken,
  updateUserById,
  updateUserSubscription,
} from '../controllers/userController.js';
import validateAuth from '../middlewares/validateAuth.js';
import validateRole from '../middlewares/validateRole.js';
import { userRoles } from '../constants/userConstants.js';

const router = express.Router();
router.param('id', validateId);

router.post('/register', validateBody(createUserSchema), createUser);

router.post('/login', validateBody(authenticateUserSchema), authenticateUser);

// Apply auth middleware
router.use(validateAuth);

router.post('/logout', removeToken);

router.get('/current', getCurrentUser);

router.patch(
  '/subscription',
  validateBody(updateUserSubscriptionSchema),
  updateUserSubscription
);

// Apply roles guard. Admin only routes
router.use(validateRole(userRoles.ADMIN));

router.get('/', getAllUsers);

router
  .route('/:id')
  .get(getUserById)
  .patch(validateBody(updateUserSchema), updateUserById)
  .delete(deleteUserById);

export default router;
