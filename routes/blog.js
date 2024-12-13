import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { createPost, deletePost, editPost, loadCurrentPost, loadUsersPosts } from "../controllers/index.js";

const blogRoutes = express.Router();

blogRoutes.post("/create-post", isAuth, createPost);
blogRoutes.get("/load-current-post/:id", isAuth, loadCurrentPost);
blogRoutes.post("/load-users-post", isAuth, loadUsersPosts);
blogRoutes.post("/edit-post/:id", isAuth, editPost);
blogRoutes.delete("/delete-post/:id", isAuth, deletePost);

export default blogRoutes;