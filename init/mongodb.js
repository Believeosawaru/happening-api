import mongoose from "mongoose";
import { connectionUrl } from "../config/keys.js";

const connectToDb = async () => {
    try {
        await mongoose.connect(connectionUrl);
        
        console.log("Database Connected Successfullys");
    } catch (error) {
        console.log(error.message);
    }
}

export default connectToDb;