import jwt from "jsonwebtoken";
import { jwtSecret } from "../config/keys.js";

const generateToken = (user) => {
    const token = jwt.sign({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
    },
    jwtSecret,
    {
        expiresIn: "7d"
    }
);

return token;
}

export default generateToken;