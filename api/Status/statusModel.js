import mongoose from "mongoose";

const Schema = mongoose.Schema

const statusModel = new Schema({
    title: {
        type: String,
        required: true,
    },
}, { timestamps: true })

export default mongoose.model("Status", statusModel)