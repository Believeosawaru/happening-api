import express from "express"
import { homeController, groupController, eventController, displayGroupController, groupInfo, editGroupInfo, showGroupInfo, deleteGroup, searchUsers, addUser, generateLink, joinViaLink, latestGroup, allGroups, joinGroup, leaveGroup, eventInfo, displayEventController, editEventInfo, showEventInfo, deleteEvent, allEvents, latestEvent, eventJoin, searchUserEvent, sendEventIv } from "../controllers/index.js";
import isAuth from "../middlewares/isAuth.js";
import isGroupCreator from "../middlewares/isGroupCreator.js";
import isEventCreator from "../middlewares/isEventCreator.js";
import { emailValidator } from "../validators/auth.js";
import { searchUsersEmail, sendGroupLink } from "../controllers/user.js";

const userRoutes = express.Router();

userRoutes.get("/home", homeController);

userRoutes.get("/home-groups", isAuth, latestGroup);

userRoutes.get("/all-groups", isAuth, allGroups);

userRoutes.post("/create-group", isAuth, groupController);

userRoutes.get("/groups", isAuth, displayGroupController);

userRoutes.get("/group/:groupId", isAuth, groupInfo);

userRoutes.post("/group/:groupId/generate-link", isAuth, isGroupCreator, generateLink);

userRoutes.post("/join-group/:groupId", isAuth, joinGroup);

userRoutes.post("/leave-group/:groupId", isAuth, leaveGroup);

userRoutes.post("/join-group/:groupToken/invite-link", isAuth, joinViaLink);

userRoutes.put("/edit-group-info/:groupId", isAuth, isGroupCreator, editGroupInfo);

userRoutes.get("/group-details/:groupId", isAuth, isGroupCreator, showGroupInfo);

userRoutes.delete("/delete-group/:groupId", isAuth, isGroupCreator, deleteGroup);

userRoutes.get("/search-users/:groupId", isAuth, isGroupCreator,  searchUsers);

userRoutes.post("/group/:groupId/add-member", isAuth, isGroupCreator, addUser);

userRoutes.get("/group/search/email-users/:groupId", isAuth, isGroupCreator, searchUsersEmail);

userRoutes.post("/group/:groupId/send-invite", isAuth, isGroupCreator, sendGroupLink);

userRoutes.post("/create-event", isAuth, eventController);

userRoutes.get("/events", isAuth, displayEventController);

userRoutes.get("/event/:eventId", isAuth, eventInfo);

userRoutes.put("/edit-event-info/:eventId", isAuth, isEventCreator, editEventInfo);

userRoutes.get("/event-details/:eventId", isAuth, isEventCreator, showEventInfo);

userRoutes.delete("/delete-event/:eventId", isAuth, isEventCreator, deleteEvent);

userRoutes.get("/all-events", isAuth, allEvents);

userRoutes.get("/home-events", isAuth, latestEvent);

userRoutes.get("/event/search-users/:eventId", isAuth, isEventCreator, searchUserEvent);

userRoutes.post("/event/:eventId/send-invite", isAuth, isEventCreator, sendEventIv);

userRoutes.post("/join-event/:eventId", isAuth, eventJoin);

export default userRoutes;