import mongoose from "mongoose";
const Schema = mongoose.Schema;
import slugify from "slugify"

const blogSchema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true }, 
    author: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    mediaPath: { type: String },
    mediaType: { type: String },
    slug: { type: String, unique: true },
    createdAt: { type: Date, default: Date.now }, 
    updatedAt: { type: Date }
}, {timestamps: true});

const convertToSlug = (title) => {
    const sanitizedTitle = title.replace(/:/g, "");

    return slugify(sanitizedTitle, { lower: true, strict: true });
}

blogSchema.pre("save", async function (next) {
    if (this.isNew || this.isModified("title")) {
        if (this.title) {
            let newSlug = convertToSlug(this.title);
            let count = 1;

            while (await mongoose.model("blog").findOne({slug: newSlug})) {
                newSlug = `${slugify(this.name)}-${count++}`;
            }

            this.slug = newSlug;
        } else {
            this.slug = `post-${Date.now()}`
        }
    } 
    next();
});

const Blog = mongoose.model("blog", blogSchema);

export default Blog;