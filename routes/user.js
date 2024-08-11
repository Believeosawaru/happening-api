import express from "express"
import { homeController, groupController, eventController, displayGroupController, groupInfo, editGroupInfo, showGroupInfo } from "../controllers/index.js";
import isAuth from "../middlewares/isAuth.js";
import isGroupCreator from "../middlewares/isGroupCreator.js";

const userRoutes = express.Router();

userRoutes.get("/home", isAuth, homeController);

userRoutes.post("/create-group", isAuth, groupController);
userRoutes.get("/groups", isAuth, displayGroupController);

userRoutes.get("/group/:groupId", isAuth, groupInfo);
userRoutes.put("/edit-group-info/:groupId", isAuth, editGroupInfo);
userRoutes.post("/group-details", isAuth, showGroupInfo);

userRoutes.post("/create-event", eventController);

export default userRoutes;