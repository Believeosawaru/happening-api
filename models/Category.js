import mongoose from "mongoose";
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    title: { type: String, required: true }
}, {timestamps: true});

const Category = mongoose.model("category", categorySchema);

export default Category;