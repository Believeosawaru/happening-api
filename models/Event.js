import mongoose from "mongoose";
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String },
    time: { type: Date, required: true },
    location: { type: String },
    type: { type: String, enum: ["public", "private"]},
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true }
}, {timestamps: true});

const Event = mongoose.model("event", eventSchema);

export default Event;