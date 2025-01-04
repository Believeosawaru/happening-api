import mongoose from "mongoose";
const Schema = mongoose.Schema;

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

const slugify = (text) => {
    text.toString().toLowerCase()
    .replace(/\s+/g,"-")
    .replace(/[^\w\-]+/g,"-")
    .replace(/\-\-+/g,"-")
    .replace(/^-+/,"-")
    .replace(/-+$/g,"-");
}

blogSchema.pre("save", async function (next) {
    if (this.isNew || this.isModified("title")) {
        if (this.title) {
            let newSlug = slugify(this.title);
            let count = 1;

            while (await mongoose.model("group").findOne({slug: newSlug})) {
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