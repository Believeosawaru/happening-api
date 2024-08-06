import jwt from "jsonwebtoken";
import { jwtSecret } from "../config/keys.js";

const isAuth = async (req, res, next) => {
    try {
        const authurization = req.headers.authurization ? req.authurization.split(" ") : [];
        const token = authurization.length > 1 ? authurization[1] : null;

        if (token) {
            const payload = jwt.verify(token, jwtSecret);

            if (payload) {
                req.user = {
                    _id: payload._id,
                    firstName: payload.firstName,
                    lastName: payload.lastName,
                    email: payload.email
                }
                next();
            } else {
                res.code = 401;
                throw new Error("Unauthorized Request")
            }
        } else {
            res.code = 400;
            throw new Error("Session Timed Out, Login Again");
        }
    } catch (error) {
        next(error)
    }
}

export default isAuth;