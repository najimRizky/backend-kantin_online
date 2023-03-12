import mongoose from "mongoose";

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
        ref: "Menu_Category",
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
}, { timestamps: true })

menuSchema.statics.addMenu = async function (_id, data) {
    try {
        const newMenu = await this.create(data)
        return newMenu
    } catch (err) {
        throw Error(err)
    }

}

export default mongoose.model("Menu", menuSchema)