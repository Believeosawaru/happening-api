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
    type: { type: String, enum: ["public", "private"]},
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    invitedUsers : [{ type: mongoose.Schema.Types.ObjectId, ref: "user"}]
}, {timestamps: true});

const Event = mongoose.model("event", eventSchema);

export default Event;