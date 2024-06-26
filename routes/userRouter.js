import express from 'express';

import {
  validateBody,
  validateFile,
  validateId,
} from '../middlewares/validateRequest.js';
import {
  authenticateUserSchema,
  createUserSchema,
  requireEmailSchema,
  updatePasswordSchema,
  updateUserSchema,
  updateUserSubscriptionSchema,
} from '../validationSchemas/userSchemas.js';
import {
  authenticateUser,
  createChat,
  createUser,
  deleteUserById,
  forgotPassword,
  getAllUsers,
  getCurrentUser,
  getUserById,
  joinChat,
  removeToken,
  resendVerifiation,
  updatePassword,
  updateUserAvatar,
  updateUserById,
  updateUserSubscription,
  verifyUser,
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
  validateBody(requireEmailSchema),
  forgotPassword
);

router.post(
  '/password/reset/:token',
  validateBody(updatePasswordSchema),
  updatePassword
);

router.post('/verify', validateBody(requireEmailSchema), resendVerifiation);
router.get('/verify/:token', verifyUser);

// Apply auth middleware
router.use(validateAuth);

router.post('/logout', removeToken);

router.get('/chat/create', createChat);
router.get('/chat/join/:room', joinChat);

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
