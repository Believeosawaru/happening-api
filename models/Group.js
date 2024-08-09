import mongoose from "mongoose";
const Schema = mongoose.Schema;

const groupSchema = new Schema({
    name: { type: String, required: true},
    description: { type: String },
    location: {type: String},
    members: [{ type: Schema.Types.ObjectId, ref: "User" }],
    groupType: {
        type: String,
        enum: ["private", "public"], required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Group = mongoose.model("group", groupSchema);

export default Group;