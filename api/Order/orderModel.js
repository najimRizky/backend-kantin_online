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
        enum: ["pending", "preparing", "ready", "finished", "rejected"],
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

orderSchema.statics.confirmOrder = async function (_id, tenant_id) {
    const confirmedOrder = await this.findOneAndUpdate({ _id, tenant: tenant_id, status: "pending" }, { status: "preparing", "progress.confirmed": new Date() })

    return confirmedOrder
}

orderSchema.statics.rejectOrder = async function (_id, tenant_id) {
    const confirmedOrder = await this.findOneAndUpdate({ _id, tenant: tenant_id, status: { $in: ["pending", "preparing"] } }, { status: "rejected", "progress.rejected": new Date() })

    return confirmedOrder
}

orderSchema.statics.serveOrder = async function (_id, tenant_id) {
    const confirmedOrder = await this.findOneAndUpdate({ _id, tenant: tenant_id, status: "preparing" }, { status: "ready", "progress.ready": new Date() })

    return confirmedOrder
}

orderSchema.statics.finishOrder = async function (_id, tenant_id) {
    const confirmedOrder = await this.findOneAndUpdate({ _id, tenant: tenant_id, status: "ready" }, { status: "finished", "progress.completed": new Date() })

    return confirmedOrder
}

export default mongoose.model("Order", orderSchema)