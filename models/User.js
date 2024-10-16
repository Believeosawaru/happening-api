import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true }, 
    email: { type: String, required: true, unique: true }, 
    password: { type: String, required: true },
    groups: [{
        type: Schema.Types.ObjectId, ref: "group"
    }],
    events: [{
        type: Schema.Types.ObjectId, ref: "event"
    }],
    bio: { type: String },
    followers: { type: Schema.Types.ObjectId, ref: "users" },
    following: { type: Schema.Types.ObjectId, ref: "users" },
    verificationCode: { type: String },
    isVerified: { type: Boolean, default: false },
    forgotPasswordCode: {type: String}
}, { timestamps: true })

const User = mongoose.model('users', userSchema)

export default User;