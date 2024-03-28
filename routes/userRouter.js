import express from 'express';

import {
  validateBody,
  validateFile,
  validateId,
} from '../middlewares/validateRequest.js';
import {
  authenticateUserSchema,
  createUserSchema,
  forgotPasswordSchema,
  updatePasswordSchema,
  updateUserSchema,
  updateUserSubscriptionSchema,
} from '../validationSchemas/userSchemas.js';
import {
  authenticateUser,
  createUser,
  deleteUserById,
  forgotPassword,
  getAllUsers,
  getCurrentUser,
  getUserById,
  removeToken,
  updatePassword,
  updateUserAvatar,
  updateUserById,
  updateUserSubscription,
} from '../controllers/userController.js';
import validateAuth from '../middlewares/validateAuth.js';
import validateRole from '../middlewares/validateRole.js';
import { userRoles } from '../constants/userConstants.js';
import { imageMiddleware } from '../middlewares/fileUploader.js';

const router = express.Router();
router.param('id', validateId);

router.post('/register', validateBody(createUserSchema), createUser);

router.post('/login', validateBody(authenticateUserSchema), authenticateUser);

router.post(
  '/password/forgot',
  validateBody(forgotPasswordSchema),
  forgotPassword
);

router.post(
  '/password/reset/:token',
  validateBody(updatePasswordSchema),
  updatePassword
);

// Apply auth middleware
router.use(validateAuth);

router.post('/logout', removeToken);

router.get('/current', getCurrentUser);

router.patch(
  '/subscription',
  validateBody(updateUserSubscriptionSchema),
  updateUserSubscription
);

router.patch(
  '/avatar',
  imageMiddleware.single('avatar'),
  validateFile('avatar'),
  updateUserAvatar
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
