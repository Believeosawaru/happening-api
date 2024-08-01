import mongoose from "mongoose";
import { connectionUrl } from "../config/keys.js";

const connectToDb = async () => {
    try {
        await mongoose.connect(connectionUrl);
        
        console.log("Database Connected Successfully");
    } catch (error) {
        console.log(error);
    }
}

export default connectToDb;