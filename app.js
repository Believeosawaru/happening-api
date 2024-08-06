import express from "express";
import { authRoutes, userRoutes } from "./routes/index.js";
import connectToDb from "./init/mongodb.js";
import errorHandler from "./middlewares/errorHandler.js"
import cors from "cors";
const app = express();

connectToDb();

app.use(cors({
  origin: 'http://127.0.0.1:5500'
}));

// app.use(cors({
//     origin: 'https://happening-khaki.vercel.app'
// }));

app.use(express.json());
app.use(express.urlencoded());
app.use("/api/v1/auth", authRoutes);
app.use("/user/v1", userRoutes);

app.use(errorHandler);

export default app;