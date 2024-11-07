import mongoose from "mongoose";
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    timeZone: { type: String, required: true},
    location: { type: String },
    category: { type: String },
    slug: { type: String, unique: true},
    type: { type: String, enum: ["public", "private"]},
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    invitedUsers : [{ type: mongoose.Schema.Types.ObjectId, ref: "user"}]
}, {timestamps: true});

const slugify = (text) => {
    text.toString().toLowerCase()
    .replace(/\s+/g,"-")
    .replace(/[^\w\-]+/g,"-")
    .replace(/\-\-+/g,"-")
    .replace(/^-+/,"-")
    .replace(/-+$/g,"-");
}

eventSchema.pre("save", async function (next) {
    if (this.isNew || this.isModified("name")) {
        if (this.name) {
            // let newSlug = slugify(this.name);
            let newSlug = ``;
            // let count = 1;

            // while (await mongoose.model("event").findOne({slug: newSlug})) {
            //     newSlug = `${this.name}`;
            //     // newSlug = `${slugify(this.name)}-${count++}`;
            // }

            this.slug = this.name;
        } else {
            this.slug = `event-${Date.now()}`
        }
    } 
    next();
});

const Event = mongoose.model("event", eventSchema);

export default Event;