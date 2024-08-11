import express from "express"
import { homeController, groupController, eventController, displayGroupController, groupInfo, editGroupInfo, showGroupInfo, deleteGroup } from "../controllers/index.js";
import isAuth from "../middlewares/isAuth.js";
import isGroupCreator from "../middlewares/isGroupCreator.js";

const userRoutes = express.Router();

userRoutes.get("/home", isAuth, homeController);

userRoutes.post("/create-group", isAuth, isGroupCreator, groupController);
userRoutes.get("/groups", isAuth, displayGroupController);
userRoutes.get("/group/:groupId", isAuth, groupInfo);
userRoutes.put("/edit-group-info/:groupId", isAuth, isGroupCreator, editGroupInfo);
userRoutes.get("/group-details/:groupId", isAuth, isGroupCreator, showGroupInfo);
userRoutes.delete("/delete-group/:groupId", isAuth, isGroupCreator, deleteGroup);

userRoutes.post("/create-event", eventController);

export default userRoutes;