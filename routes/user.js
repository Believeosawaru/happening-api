import express from "express"
import { homeController, groupController, eventController, displayGroupController, groupInfo, editGroupInfo, showGroupInfo, deleteGroup, searchUsers, addUser, generateLink, joinViaLink, latestGroup, allGroups, joinGroup, leaveGroup, publicGroupController, eventInfo, displayEventController, filterEvents, editEventInfo, showEventInfo, deleteEvent, allEvents, latestEvent, eventJoin, searchUserEvent, sendEventIv, publicEventController, myProfile, userProfile, followUser, myBio,unfollowUser, myNotifications, uploadPicture, accessPasswordChange, changePassword } from "../controllers/index.js";
import isAuth from "../middlewares/isAuth.js";
import isGroupCreator from "../middlewares/isGroupCreator.js";
import isEventCreator from "../middlewares/isEventCreator.js";
import { searchUsersEmail, sendGroupLink } from "../controllers/user.js";
import multer from "multer";

const userRoutes = express.Router();

userRoutes.get("/home", isAuth, homeController);

userRoutes.get("/user-profile/:userId", isAuth, userProfile);

userRoutes.get("/follow-user/:userId", isAuth, followUser);

userRoutes.get("/unfollow-user/:userId", isAuth, unfollowUser);

userRoutes.get("/my-profile", isAuth, myProfile);

userRoutes.post("/my-bio", isAuth, myBio);

userRoutes.get("/my-notifications", isAuth, myNotifications);

userRoutes.post("/access-password-change", isAuth, accessPasswordChange);

userRoutes.post("/change-password", isAuth, changePassword);

userRoutes.get("/home-groups", isAuth, latestGroup);

userRoutes.get("/all-groups", isAuth, allGroups);

userRoutes.post("/create-group", isAuth, groupController);

userRoutes.get("/groups", isAuth, displayGroupController);

userRoutes.get("/group/:groupId", isAuth, groupInfo);

userRoutes.get("/group/:groupId/generate-link", isAuth, isGroupCreator, generateLink);

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

userRoutes.get("/public-groups", publicGroupController);

// End of Group Routes

userRoutes.post("/create-event", isAuth, eventController);

userRoutes.get("/events", isAuth, displayEventController);

userRoutes.post("/filter-events", isAuth, filterEvents);

userRoutes.get("/event/:eventId", isAuth, eventInfo);

userRoutes.put("/edit-event-info/:eventId", isAuth, isEventCreator, editEventInfo);

userRoutes.get("/event-details/:eventId", isAuth, isEventCreator, showEventInfo);

userRoutes.delete("/delete-event/:eventId", isAuth, isEventCreator, deleteEvent);

userRoutes.get("/all-events", isAuth, allEvents);

userRoutes.get("/home-events", isAuth, latestEvent);

userRoutes.get("/event/search-users/:eventId", isAuth, isEventCreator, searchUserEvent);

userRoutes.post("/event/:eventId/send-invite", isAuth, isEventCreator, sendEventIv);

userRoutes.post("/join-event/:name", isAuth, eventJoin);

userRoutes.get("/public-events", publicEventController);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads/'); // Specify the directory where files should be stored
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname); // Specify the filename
    }
});
 
const upload = multer({ 
      storage: storage,
      limits: {
      fileSize: 20 * 1024 * 1024 // 20 MB
      },
});

userRoutes.post("/upload", upload.single("profilePicture"), isAuth, uploadPicture);

export default userRoutes;