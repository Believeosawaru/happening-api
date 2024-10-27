import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  uploadDate: { type: Date, default: Date.now }
});

const File = mongoose.model('file', fileSchema);

export default File;
