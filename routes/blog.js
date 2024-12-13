import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { createPost, deletePost, editPost, loadCurrentPost, loadUsersPosts } from "../controllers/index.js";

const blogRoutes = express.Router();

blogRoutes.post("/create-post", isAuth, createPost);
blogRoutes.post("/load-current-post", isAuth, loadCurrentPost);
blogRoutes.post("/load-users-post", isAuth, loadUsersPosts);
blogRoutes.post("/edit-post", isAuth, editPost);
blogRoutes.post("/delete-post", isAuth, deletePost);

export default blogRoutes;