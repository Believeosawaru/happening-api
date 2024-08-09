import express from "express"
import { homeController, groupController, eventController } from "../controllers/index.js";
import isAuth from "../middlewares/isAuth.js";

const userRoutes = express.Router();

userRoutes.get("/home", isAuth, homeController);

userRoutes.post("/create-group", isAuth, groupController);

userRoutes.post("/create-event", eventController);

export default userRoutes;