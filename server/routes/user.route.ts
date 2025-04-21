import express from "express";
import { checkAuth, forgotPassword, login, logout, resetPassword, signup, updateProfile, verifyEmail } from "../controller/user.controller";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { validateRequest } from "../middlewares/validateRequest";
import { signupSchema, loginSchema, verifyEmailSchema, forgotPasswordSchema, resetPasswordSchema } from "../validations/authValidation";

const router = express.Router();

router.route("/check-auth").get(isAuthenticated, checkAuth);
router.route("/signup").post(validateRequest(signupSchema), signup);
router.route("/login").post(validateRequest(loginSchema), login);
router.route("/logout").post(logout);
router.route("/verify-email").post(validateRequest(verifyEmailSchema), verifyEmail);
router.route("/forgot-password").post(validateRequest(forgotPasswordSchema), forgotPassword);
router.route("/reset-password/:token").post(validateRequest(resetPasswordSchema), resetPassword);
router.route("/profile/update").put(isAuthenticated, updateProfile);

export default router;