import mongoose from "mongoose";

const Schema = mongoose.Schema

const cartSchema = new Schema({
    tenant: {
        type: Schema.Types.ObjectId,
        ref: "Tenant",
        required: true
    },
    customer: {
        type: Schema.Types.ObjectId,
        ref: "Customer",
        required: true
    },
    items: [{
        menu: {
            type: Schema.Types.ObjectId,
            ref: "Menu",
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
    }],
}, { timestamps: true })

export default mongoose.model("Cart", cartSchema)