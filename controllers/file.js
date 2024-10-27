import mongoose from "mongoose";
import multer from "multer";
import GridFsStorage from "multer-gridfs-storage";
import Grid from "gridfs-stream";

const mongoURI = 'your_mongodb_connection_string_here';

const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return {
      filename: file.originalname,
      bucketName: 'uploads'
    };
  }
});

const upload = multer({ storage });

// Upload image
const uploadImage = (req, res) => {
  res.status(200).json({ file: req.file });
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
