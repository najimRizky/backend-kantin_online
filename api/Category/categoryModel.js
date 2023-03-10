import mongoose from "mongoose";

const Schema = mongoose.Schema

const categoryModel = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
}, { timestamps: true })

export default mongoose.model("Category", categoryModel)