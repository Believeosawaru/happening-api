import express from "express"
import { homeController, groupController, eventController, displayGroupController } from "../controllers/index.js";
import isAuth from "../middlewares/isAuth.js";

const userRoutes = express.Router();

userRoutes.get("/home", isAuth, homeController);

userRoutes.post("/create-group", isAuth, groupController);
userRoutes.get("/groups", isAuth, displayGroupController);

userRoutes.post("/create-event", eventController);

export default userRoutes;