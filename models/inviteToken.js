import mongoose from "mongoose";

const inviteTokenSchema = new mongoose.Schema({
    token: { type: String, required: true, unique: true },
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: "group", required: true },
    expiresAt: { type: Date, default: Date.now, index: { expiresIn: "7d" } }
});

const InviteToken = mongoose.model("invite-token", inviteTokenSchema)

export default InviteToken;