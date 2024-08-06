import jwt from "jsonwebtoken";
import { jwtSecret } from "../config/keys.js";

const isAuth = async (req, res, next) => {
    try {
       const authHeader = req.headers['authorization'];
       const token = authHeader && authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                code: 401,
                status: false, 
                message: "Unauthorized Request"
            })
        } 
        
        jwt.verify(token, jwtSecret, (err, user) => {
            if (err) {
                return res.status(401).json({
                    code: 403,
                    status: false, 
                    message: "Fotbidden Request"
                })
            }

            req.user = user;
            next();
        })
    } catch (error) {
        next(error)
    }
}

export default isAuth;