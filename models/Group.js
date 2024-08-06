import mongoose from "mongoose";
const Schema = mongoose.Schema;

const groupSchema = new Schema({
    name: { type: String, required: true},
    description: { type: String },
    members: [{ type: Schema.Types.ObjectId, ref: "User" }],
    events: [{ type: Schema.Types.ObjectId, ref: "Event" }]
});

const Group = mongoose.model("group", groupSchema);

export default Group;