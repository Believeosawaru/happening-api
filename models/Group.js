import mongoose from "mongoose";
const Schema = mongoose.Schema;

const groupSchema = new Schema({
    name: { type: String, required: true},
    description: { type: String },
    location: {type: String},
    members: [{ type: Schema.Types.ObjectId, ref: "users" }],
    inviteLink: { type: String, default: null },
    slug: { type: String, unique: true },
    groupType: {
        type: String,
        enum: ["private", "public"], required: true
    },
    category: { type: String },
    registrationDeadline: { type: Date, required: true },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const slugify = (text) => {
    text.toString().toLowerCase()
    .replace(/\s+/g,"-")
    .replace(/[^\w\-]+/g,"-")
    .replace(/\-\-+/g,"-")
    .replace(/^-+/,"-")
    .replace(/-+$/g,"-");
}

groupSchema.pre("save", async function (next) {
    if (this.isNew || this.isModified("name")) {
        if (this.name) {
            let newSlug = slugify(this.name);
            let count = 1;

            while (await mongoose.model("group").findOne({slug: newSlug})) {
                newSlug = `${slugify(this.name)}-${count++}`;
            }

            this.slug = newSlug;
        } else {
            this.slug = `event-${Date.now()}`
        }
    } 
    next();
});

const Group = mongoose.model("group", groupSchema);

export default Group;