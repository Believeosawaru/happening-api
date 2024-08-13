import express from "express"
import { homeController, groupController, eventController, displayGroupController, groupInfo, editGroupInfo, showGroupInfo, deleteGroup, searchUsers, addUser, joinViaLink } from "../controllers/index.js";
import isAuth from "../middlewares/isAuth.js";
import isGroupCreator from "../middlewares/isGroupCreator.js";

const userRoutes = express.Router();

userRoutes.get("/home", isAuth, homeController);

userRoutes.post("/create-group", isAuth, groupController);

userRoutes.get("/groups", isAuth, displayGroupController);

userRoutes.get("/group/:groupId", isAuth, groupInfo);

userRoutes.get("/join-group/:groupId/invite-link", joinViaLink);

userRoutes.put("/edit-group-info/:groupId", isAuth, isGroupCreator, editGroupInfo);

userRoutes.get("/group-details/:groupId", isAuth, isGroupCreator, showGroupInfo);

userRoutes.delete("/delete-group/:groupId", isAuth, isGroupCreator, deleteGroup);

userRoutes.get("/search-users/:groupId", isAuth, isGroupCreator,  searchUsers);

userRoutes.post("/group/:groupId/add-member", isAuth, isGroupCreator, addUser);

userRoutes.post("/create-event", eventController);

export default userRoutes;