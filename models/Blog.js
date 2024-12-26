import mongoose from "mongoose";
const Schema = mongoose.Schema;

const blogSchema = new Schema({
    content: { type: String, required: true }, 
    author: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    mediaPath: { type: String },
    mediaType: { type: String },
    createdAt: { type: Date, default: Date.now }, 
    updatedAt: { type: Date }
}, {timestamps: true});

const Blog = mongoose.model("blog", blogSchema);

export default Blog;