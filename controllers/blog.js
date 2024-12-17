import { Blog, User } from "../models/index.js";
import { ObjectId } from "mongodb";

const createPost = async (req, res, next) => {
    try {
        const { content } = req.body;
        const userId = new ObjectId(String(req.user._id));

        const blogPost = new Blog({ content, author: userId });
        const user = await User.findById(userId);

        user.posts.push(blogPost._id);

        await blogPost.save();
        await user.save();

        res.status(201).json({
            code: 201,
            status: true,
            message: `Post Created Successfully ${user}`
        });
    } catch (error) {
        next(error);
    }
}

const loadCurrentPost = async (req, res, next) => {
    try {
        const postId = new ObjectId(String(req.params.id));

        const blogPost = await Blog.findById(postId);

        if (!blogPost) {
            res.code = 404;
            throw new Error("Post Not Found")
        }

        res.status(200).json({
            code: 200,
            status: true,
            data: {
                content: blogPost.content
            }
        });
    } catch (error) {
        next(error);
    }
}

const loadPosts = async (req, res, next) => {
    try {
        const posts = await Blog.find({});

        res.status(200).json({
            code: 200,
            status: true,
            data: posts
        });
    } catch (error) {
        next(error);
    }
}

const editPost = async (req, res, next) => {
    try {
        const { content } = req.body;

        const postId = new ObjectId(String(req.params.id));

        const blogPost = await Blog.findById(postId);

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
        const postId = new ObjectId(String(req.params.id));

        await Blog.findByIdAndDelete(postId);

        res.status(200).json({
            code: 200,
            status: true,
            message: "Post Deleted Successfully"
        });
    } catch (error) {
        next(error);
    }
}

export { createPost, loadCurrentPost, loadPosts, editPost, deletePost }