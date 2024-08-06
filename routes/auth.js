import express from "express";
import { signUpController, signInController, recoverPassword, changePassword, verifyUser, forgotPassword } from "../controllers/index.js";
import { signUpValidator, signInValidator, emailValidator, verifyUserValidator, recoverPasswordValidator, changePasswordValidator } from "../validators/auth.js";
import validate from "../validators/validate.js";
import isAuth from "../middlewares/isAuth.js";

const authRoutes = express.Router();

authRoutes.post("/sign-up", signUpValidator, validate, signUpController);

authRoutes.post("/sign-in", signInValidator, validate, signInController);

// authRoutes.post("/send-verification-email", emailValidator, validate, verifyCode);

authRoutes.post("/verify-user", verifyUserValidator, validate, isAuth, verifyUser);

authRoutes.post("/forgot-password-code", emailValidator, validate, forgotPassword);

authRoutes.post("/recover-password", recoverPasswordValidator, validate, isAuth, recoverPassword);

authRoutes.put("/change-password", changePasswordValidator, validate, isAuth, changePassword);

export default authRoutes;