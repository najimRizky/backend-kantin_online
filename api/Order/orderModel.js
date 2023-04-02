import mongoose from "mongoose";

const Schema = mongoose.Schema

const orderSchema = new Schema({
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
    review: {
        type: Schema.Types.ObjectId,
        ref: "Review",
        default: null
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
    progress: {
        created: {
            type: Date,
            default: Date.now,
            required: true
        },
        confirmed: {
            type: Date,
            default: null
        },
        ready: {
            type: Date,
            default: null
        },
        completed: {
            type: Date,
            default: null
        },
        rejected: {
            type: Date,
            default: null
        },
    },
    status: {
        type: String,
        enum: ["pending", "preparing", "ready", "completed", "cancelled"],
        required: true
    },
    total_price: {
        type: Number,
        required: true
    },
    payment_method: {
        type: String,
        required: true,
        default: ""
    }
}, { timestamps: true })

orderSchema.statics.createOrder = async function (newOrder) {
    const createdOrder = await this.create(newOrder)

    return createdOrder
}

export default mongoose.model("Order", orderSchema)