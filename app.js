import express from "express";
import authRoutes from "./routes/index.js";
import connectToDb from "./init/mongodb.js";
import errorHandler from "./middlewares/errorHandler.js"
const app = express();

connectToDb();

app.use(express.json());
app.use("/api/v1/auth", authRoutes);

app.use(errorHandler);

export default app;