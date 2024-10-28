import fs from "fs";
import multer from "multer";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const uploadsDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir)
    console.log("DONE")
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        try {
            cb(null, "uploads/");
        } catch (error) {
            console.log(error)
        }
    },
    filename: (req, file, cb) => {
        try {
            cb(null, `${Date.now()}-${file.originalname}`);
        } catch (error) {
            console.log(error)
        }
    }
});

const upload = multer({ storage });

export default upload;