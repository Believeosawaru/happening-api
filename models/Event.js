import mongoose from "mongoose";
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String },
    date: { type: String, required: true },
    group: { type: Schema.Types.ObjectId, ref: "Group"},
    createdBy: { type: Schema.Types.ObjectId, ref: "User" }
});

const Event = mongoose.model("event", eventSchema);

export default Event;