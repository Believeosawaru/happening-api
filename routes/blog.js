import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { createPost, deletePost, editPost, loadCurrentPost, loadPosts, loadPublicPosts, loadBlogPost, publicBlogPost, createCategory, deleteCategory, showCategories } from "../controllers/index.js";
import isAdmin from "../middlewares/isAdmin.js";
import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      if (file.mimetype.startsWith("video/")) {
        cb(null, './uploads/videos/');
      } else if (file.mimetype.startsWith("image/")) {
        cb(null, './uploads/images/');
      } else {
        cb(new Error("Unsupported File Type"))
      }
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname); // Specify the filename
    }
});
 
const upload = multer({ 
      storage: storage,
      limits: {
      fileSize: 100 * 1024 * 1024, // 20 MB
      files: 1
      },
    //   fileFilter: (req, file, cb) => {
    //     const filetypes = /jpeg|jpg|png|gif|mp4|mov|avi/;
    //     const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    //     const mimetype = filetypes.test(file.mimetype);

    //      if (extname && mimetype) {
    //         cb(null, true);
    //      } else {
    //         cb(new Error("Invalid File Type"))
    //      }
    //   }
 });

const blogRoutes = express.Router();

blogRoutes.post("/create-post", isAuth, isAdmin, upload.single("media"), createPost);
blogRoutes.get("/load-current-post/:slug", isAuth, isAdmin, loadCurrentPost);
blogRoutes.get("/blog-post/:slug", isAuth, loadBlogPost); // Single Post Route (For Users)
blogRoutes.get("/public-blog-post/:slug", publicBlogPost); // Single Post Route (For Public)
blogRoutes.get("/load-posts", isAuth, loadPosts);
blogRoutes.get("/public-feed", loadPublicPosts);
blogRoutes.post("/edit-post/:slug", isAuth, isAdmin, editPost);
blogRoutes.delete("/delete-post/:slug", isAuth, isAdmin, deletePost);
blogRoutes.post("/create-category", isAuth, isAdmin, createCategory);
blogRoutes.delete("/delete-category/:categoryId", isAuth, isAdmin, deleteCategory);
blogRoutes.get("/load-categories", isAuth, isAdmin, showCategories);

export default blogRoutes;