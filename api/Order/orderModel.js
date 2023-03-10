import mongoose from "mongoose";

const Schema = mongoose.Schema

const orderModel = new Schema({
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
        price: {
            type: Number,
            required: true
        }
    }],
    statuses: [{
        status: {
            type: Schema.Types.ObjectId,
            ref: "Status",
            required: true
        },
        createdAt: {
            type: Date,
            required: true
        }
    }],
    total_price: {
        type: Number,
        required: true
    }
}, { timestamps: true })

export default mongoose.model("Order", orderModel)