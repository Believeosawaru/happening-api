import jwt from "jsonwebtoken";
import { jwtSecret } from "../config/keys.js";

const authToken = (req, res, next) => {
    const authHeader = req.headers["auth"];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            code: 401,
            status: false,
            message: "Unauthorized User"
        });
    }

    jwt.verify(token, jwtSecret, (err, user) => {
        if (err) {
            return res.status(403).json({
                code: 403,
                status: false,
                message: "Forbidden User"
            })
        }

        req.user = user;
        next();
    })
}

export default authToken;