import { Blog, User } from "../models/index.js";
import { ObjectId } from "mongodb";

const createPost = async (req, res, next) => {
    try {
        const { title, content } = req.body;
        const userId = new ObjectId(String(req.user._id));
        const file = req.file;
        const fileName = file ? file.filename : null;
        let path = fileName ? fileName : null;
        const type = file ? file.mimetype.startsWith("image/") ? "image" : "video" : null;

        const blogPost = new Blog({ title, content, author: userId, mediaPath: path, mediaType: type
        });
        
        const user = await User.findById(userId);

        user.posts.push(blogPost._id);

        await blogPost.save();
        await user.save();

        res.status(201).json({
            code: 201,
            status: true,
            message: `Post Created Successfully`
        });
    } catch (error) {
        next(error);
    }
}

const loadCurrentPost = async (req, res, next) => {
    try {
        const slug = req.params.slug;

        const blogPost = await Blog.findOne({ slug });

        if (!blogPost) {
            res.code = 404;
            throw new Error("Post Not Found")
        }

        res.status(200).json({
            code: 200,
            status: true,
            data: {
                title: blogPost.title,
                content: blogPost.content,
                slug: blogPost.slug
            }
        });
    } catch (error) {
        next(error);
    }
}

const loadBlogPost = async (req, res, next) => {
    try {
        const userId = new ObjectId(String(req.user._id));
        const slug = req.params.slug;

        const blogPost = await Blog.findOne({ slug }).populate("author");
        const user = await User.findById(userId);

        if (!blogPost) {
            res.code = 404;
            throw new Error("Post Not Found")
        }

        res.status(200).json({
            code: 200,
            status: true,
            data: blogPost,
            user
        });
    } catch (error) {
        next(error);
    }
}

const publicBlogPost = async (req, res, next) => {
    try {
        const slug = req.params.slug;

        const blogPost = await Blog.findOne({ slug }).populate("author");

        if (!blogPost) {
            res.code = 404;
            throw new Error("Post Not Found")
        }

        res.status(200).json({
            code: 200,
            status: true,
            data: blogPost
        });
    } catch (error) {
        next(error);
    }
}

const loadPosts = async (req, res, next) => {
    try {
        const id = new ObjectId(String(req.user._id));
        const posts = await Blog.find({}).populate("author");

        const user = await User.findById(id);

        res.status(200).json({
            code: 200,
            status: true,
            data: posts,
            role: user.role
        });
    } catch (error) {
        next(error);
    }
}

const loadPublicPosts = async (req, res, next) => {
    try {
        const posts = await Blog.find({}).populate("author");

        res.status(200).json({
            code: 200,
            status: true,
            data: posts,
        });
    } catch (error) {
        next(error);
    }
}

const editPost = async (req, res, next) => {
    try {
        const { title, content } = req.body;
        const slug = req.params.slug;

        const blogPost = await Blog.findOne({ slug });

        if (!blogPost) {
            res.code = 404;
            throw new Error("Post Not Found")
        }

        const userId = new ObjectId(String(req.user._id));

        const user = await User.findById(userId)

        if (String(user._id) !==  String(blogPost.author)) {
           res.code = 400;
           throw new Error("You Are Not Authorized To Perform This Task!")
        }

        blogPost.title = title;
        blogPost.content = content;

        await blogPost.save();

        res.status(200).json({
            code: 200,
            status: true,
            message: "Post Edited Successfully"
        });
    } catch (error) {
        next(error);
    }
}

const deletePost = async (req, res, next) => {
    try {
        const slug = req.params.slug;

        await Blog.findOneAndDelete({ slug });

        res.status(200).json({
            code: 200,
            status: true,
            message: "Post Deleted Successfully"
        });
    } catch (error) {
        next(error);
    }
}

export { createPost, loadCurrentPost, loadPosts, editPost, deletePost, loadPublicPosts, loadBlogPost, publicBlogPost }