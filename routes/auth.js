import express from "express";
import { signUpController, signInController, recoverPassword, changePassword, verifyUser, forgotPassword, sendOnLoad, logOut } from "../controllers/index.js";
import { signUpValidator, signInValidator, emailValidator, verifyUserValidator, recoverPasswordValidator, changePasswordValidator } from "../validators/auth.js";
import validate from "../validators/validate.js";
import isAuth from "../middlewares/isAuth.js";

const authRoutes = express.Router();

authRoutes.post("/sign-up", signUpValidator, validate, signUpController);

authRoutes.post("/sign-in", signInValidator, validate, signInController);

authRoutes.get("/send-on-load", isAuth, sendOnLoad);

authRoutes.post("/verify-user", verifyUserValidator, isAuth, verifyUser);

authRoutes.post("/forgot-password-code", emailValidator, validate, forgotPassword);

authRoutes.post("/recover-password", recoverPasswordValidator, validate, recoverPassword);

authRoutes.put("/change-password", changePasswordValidator, validate, isAuth, changePassword);

authRoutes.post("/log-out", isAuth, logOut);

export default authRoutes;