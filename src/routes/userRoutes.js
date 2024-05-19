import express from "express";
import {
  deleteUser,
  forgotPassword,
  getAllUser,
  getSingleUser,
  loginUser,
  resetForgotPassword,
  resetPassword,
  updateUser,
  userRegister,
} from "../controller/userController.js";
import { validate } from "../middleware/validate-middleware.js";
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetForgotPasswordSchema,
  updateUserSchema,
} from "../validators/user-validation.js";
import {
  authorizeRoles,
  isAuthenticatedUser,
} from "../middleware/decodeToken.js";

const userRouter = express.Router();

userRouter.route("/register").post(validate(registerSchema), userRegister);
userRouter.route("/login").post(validate(loginSchema), loginUser);
userRouter
  .route("/delete/:id")
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);
userRouter
  .route("/find-all")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllUser);
userRouter.route("/find-one/:id").get(isAuthenticatedUser, getSingleUser);
userRouter
  .route("/update")
  .put(isAuthenticatedUser, validate(updateUserSchema), updateUser);
userRouter
  .route("/forgot/reset-password")
  .post(validate(resetForgotPasswordSchema), resetForgotPassword);
userRouter
  .route("/forgot-password")
  .post(validate(forgotPasswordSchema), forgotPassword);
userRouter.route("/reset-password").post(isAuthenticatedUser, resetPassword);

export default userRouter;
