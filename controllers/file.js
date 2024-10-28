import User from "../models/User.js";

const uploadImage = async (req, res, next) => {
   try {
      const userId = req.user._id;

      const user = await User.findById(userId);

      // if (!req.file) {
      //   res.status(400).json({
      //     code: 400,
      //     status: false,
      //     message: "No file uploaded"
      //   });
      // }

      const filePath = `/upload/${req.file.filename}`;

        // user.profilePicture = filePath;

        // user.save();

        res.status(200).json({
          code: 200,
          status: true,
          message: `Image Uploaded Successfully ${filePath}`
        });
   } catch (error) {
        next(error)
   }
};

// Get image by filename
// const getImage = (req, res) => {
  
// };

export { uploadImage }
