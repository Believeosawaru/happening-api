import jwt from "jsonwebtoken";
import { jwtSecret } from "../config/keys.js";

const isAuth = async (req, res, next) => {
    try {
       const authHeader = req.headers['authorization'];
       const token = req.headers['authorization']?.split(' ')[1]; // Extract token from "Bearer [token]"


        if (!token) {
            return res.status(401).json({
                code: 401,
                status: false, 
                message: "Unauthorized Request"
            })
        } 
        
        jwt.verify(token, jwtSecret, (err, user) => {
            if (err) {
                return res.status(403).json({
                    code: 403,
                    status: false,
                    message: err.message
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