import crypto from "crypto";

const generateInviteToken = () => {
    return crypto.randomBytes(16).toString("hex");
}

export default generateInviteToken;