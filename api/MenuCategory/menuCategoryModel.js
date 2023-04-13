import mongoose from "mongoose";

const Schema = mongoose.Schema

const menuCategoryModel = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    tenant: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Tenant",
    },
}, { timestamps: true })

export default mongoose.model("MenuCategory", menuCategoryModel)