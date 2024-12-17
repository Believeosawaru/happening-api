import User from "../models/User.js"; 
import { ObjectId } from "mongodb";

const isAdmin = async (req, res, next) => {
    const uId = new ObjectId(String(req.user._id));

    const user = await User.findById(uId)

    if (user && user.role === "admin") {
        next();
    } else {
        res.status(400).json({
            code: 400,
            status: false,
            message: "Unauthorized, Admins Only."
        })
    }
}

export default isAdmin;