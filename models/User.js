import mongoose from "mongoose";
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    message: String,
    timestamp: { type: Date, default: Date.now },
    read: { type: Boolean, default: false },
  });

const userSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true }, 
    email: { type: String, required: true, unique: true }, 
    password: { type: String, required: true },
    profilePicture: { type: String, default: null },
    groups: [{
        type: Schema.Types.ObjectId, ref: "group"
    }],
    events: [{
        type: Schema.Types.ObjectId, ref: "event"
    }],
    bio: { type: String, default: "" },
    followers: [{ type: Schema.Types.ObjectId, ref: "user" }],
    following: [{ type: Schema.Types.ObjectId, ref: "user" }],
    verificationCode: { type: String },
    isVerified: { type: Boolean, default: false },
    forgotPasswordCode: { type: String },
    notifications: [notificationSchema]
}, { timestamps: true })

const User = mongoose.model('users', userSchema)

export default User;