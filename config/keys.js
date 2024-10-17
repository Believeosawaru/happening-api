import dotenv from "dotenv";
dotenv.config();

const port = process.env.PORT
const connectionUrl = process.env.CONNECTION_URL;
const jwtSecret = process.env.JWT_SECRET;
const senderEmail = process.env.SENDER_EMAIL;
const emailPass = process.env.EMAIL_PASS
const openAIKey = process.env.OPENAI_API_KEY;

export {port, connectionUrl, jwtSecret, senderEmail, emailPass, openAIKey};