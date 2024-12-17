import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { createPost, deletePost, editPost, loadCurrentPost, loadUsersPosts } from "../controllers/index.js";
import isAdmin from "../middlewares/isAdmin.js";

const blogRoutes = express.Router();

blogRoutes.post("/create-post", isAuth, isAdmin, createPost);
blogRoutes.get("/load-current-post/:id", isAuth, isAdmin, loadCurrentPost);
blogRoutes.post("/load-users-post", isAuth, isAdmin, loadUsersPosts);
blogRoutes.post("/edit-post/:id", isAuth, isAdmin, editPost);
blogRoutes.delete("/delete-post/:id", isAuth, isAdmin, deletePost);

export default blogRoutes;