import mongoose from "mongoose";

const Schema = mongoose.Schema

const reviewModel = new Schema({
    customer: {
        type: Schema.Types.ObjectId,
        ref: "Customer",
        required: true,
    },
    tenant: {
        type: Schema.Types.ObjectId,
        ref: "Tenant",
        required: true,
    },
    score: {
        type: Number,
        required: true,
    },
    content: {
        type: String,
        default: ""
    },
}, { timestamps: true })

export default mongoose.model("Review", reviewModel)