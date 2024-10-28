// import User from "../models/User.js";

const uploadImage = async (req, res, next) => {
   try {
        res.status(200).json({
            code: 200,
            status: true,
            message: "DONE"
        });
   } catch (error) {
        next(error)
   }
};

// Get image by filename
// const getImage = (req, res) => {
  
// };

export { uploadImage }
