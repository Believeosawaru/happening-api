import express from "express";
import { signUpController, signInController,verifyCode, homeController } from "../controllers/index.js";
import { signUpValidator, signInValidator, emailValidator } from "../validators/auth.js";
import validate from "../validators/validate.js";
import authToken from "../utils/authToken.js";

const authRoutes = express.Router();
const userRoutes = express.Router();

authRoutes.post("/sign-up", signUpValidator, validate, signUpController);

authRoutes.post("/sign-in", signInValidator, validate, signInController);

authRoutes.post("/send-verification-email", emailValidator, validate, verifyCode);

userRoutes.get("/home", authToken, homeController);

export {authRoutes, userRoutes};