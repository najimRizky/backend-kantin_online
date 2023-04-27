import mongoose from "mongoose";
import { isNotDeleted } from "../../config/queryConfig.js";

const Schema = mongoose.Schema

const menuSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: "",
    },
    tenant: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Tenant",
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "MenuCategory",
        default: null,
    },
    image: {
        type: String,
        default: ""
    },
    price: {
        type: Number,
        required: true,
    },
    prep_duration: {
        type: Number,
        required: true,
    },
    is_deleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

menuSchema.statics.addMenu = async function (_id, data) {
    try {
        const newMenu = await this.create(data)
        return newMenu
    } catch (err) {
        throw Error(err)
    }

}

menuSchema.pre(["find", "findOne", "fingOneAndUpdate"], function (next) {
    const existingFilters = this.getFilter()
    this.where({ ...existingFilters, $or: isNotDeleted })
    next()
})

menuSchema.pre("aggregate", function (next) {
    this.pipeline().unshift({ $match: { $or: isNotDeleted } })
    next()
})

export default mongoose.model("Menu", menuSchema)