import dotenv from "dotenv";
dotenv.config();

const port = process.env.PORT
const connectionUrl = process.env.CONNECTION_URL;
const jwtSecret = process.env.JWT_SECRET;

export {port, connectionUrl, jwtSecret};