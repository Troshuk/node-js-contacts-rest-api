import express from "express";

import { validateBody } from "../middlewares/validateRequest.js";
import {
  authenticateUserSchema,
  createUserSchema,
  updateUserSubscriptionSchema,
} from "../validationSchemas/usersSchemas.js";
import {
  authenticateUser,
  createUser,
  getCurrentUser,
  removeToken,
  updateUserSubscription,
} from "../controllers/usersController.js";
import validateAuth from "../middlewares/validateAuth.js";

const usersRouter = express.Router();

usersRouter.post("/register", validateBody(createUserSchema), createUser);

usersRouter.post(
  "/login",
  validateBody(authenticateUserSchema),
  authenticateUser
);

// Apply auth middleware
usersRouter.use(validateAuth);

usersRouter.post("/logout", removeToken);

usersRouter.get("/current", getCurrentUser);

usersRouter.patch(
  "/subscription",
  validateBody(updateUserSubscriptionSchema),
  updateUserSubscription
);

export default usersRouter;
