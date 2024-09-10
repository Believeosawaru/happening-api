import express from "express";
import { authRoutes, userRoutes } from "./routes/index.js";
import connectToDb from "./init/mongodb.js";
import errorHandler from "./middlewares/errorHandler.js";
import cors from "cors";
import { dirname } from "path";
import path from "path";
import { fileURLToPath } from "url";
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

connectToDb();

app.set("view-engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// app.use(cors({
//   origin: 'http://127.0.0.1:5500'
// }));

app.use(cors({
    origin: 'http://5.161.186.15'
}));

app.use(express.json());
app.use(express.urlencoded());
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);

app.use(errorHandler);

export default app;