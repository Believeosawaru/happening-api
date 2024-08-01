import express from "express";
import authRoutes from "./routes/index.js";
import connectToDb from "./init/mongodb.js";
import errorHandler from "./middlewares/errorHandler.js"
import cors from "cors";
const app = express();

connectToDb();

app.use(cors);
app.use(express.json());
app.use(express.urlencoded());
app.use("/api/v1/auth", authRoutes);

app.use(errorHandler);

export default app;