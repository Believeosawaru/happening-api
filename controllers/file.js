import mongoose from "mongoose";
import multer from "multer";
import GridFsStorage from "multer-gridfs-storage";
import Grid from "gridfs-stream";
import { connectionUrl } from "../config/keys.js";
import User from "../models/User.js";

const storage = new GridFsStorage({
  url: connectionUrl,
  file: (req, file) => {
    return {
      filename: file.originalname,
      bucketName: 'uploads'
    };
  }
});

const upload = multer({ storage });

// Upload image
const uploadImage = async (req, res) => {
   try {
        const userId = req.user._id; 
        const uploadedFile = req.file;

        if (!uploadedFile) {
            res.status(400).json({ 
                code: 400,
                status: false,
                message: 'File not uploaded' 
            });
        }

        await User.findByIdAndUpdate(userId, {
        profilePicture: uploadedFile.filename
        });

        res.status(200).json({ 
            code: 200,
            status: true,
            file: uploadedFile
         });
   } catch (error) {
        next(error)
   }
};

// Get image by filename
const getImage = (req, res) => {
  const gfs = Grid(mongoose.connection.db, mongoose.mongo);
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    if (!file || file.length === 0) {
      return res.status(404).json({ err: 'No file exists' });
    }
    const readstream = gfs.createReadStream(file.filename);
    readstream.pipe(res);
  });
};

export { upload, uploadImage, getImage }
