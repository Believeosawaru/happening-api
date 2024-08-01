import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true }, 
    email: { type: String, required: true, unique: true }, 
    password: { type: String, required: true },
    verificationCode: { type: String },
    isVerified: { type: Boolean, default: false }
}, { timestamps: true })

const User = mongoose.model('users', userSchema)

export default User;