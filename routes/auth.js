import express from "express";
import {signUpController, signInController} from "../controllers/index.js";
import { signUpValidator, signInValidator, emailValidator } from "../validators/auth.js";
import validate from "../validators/validate.js";
import { verifyCode } from "../controllers/auth.js";

const authRoutes = express.Router();

authRoutes.post("/sign-up", signUpValidator, validate, signUpController);

authRoutes.post("/sign-in", signInValidator, validate, signInController);

authRoutes.post("/send-verification-email", emailValidator, validate, verifyCode);

export default authRoutes;