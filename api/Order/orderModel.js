import moment from "moment";
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
        preparing: {
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
        enum: ["created", "preparing", "ready", "completed", "rejected"],
        required: true
    },
    total_price: {
        type: Number,
        required: true
    },
    total_prep_duration: {
        type: Number,
        required: true
    },
    payment_method: {
        type: String,
        default: ""
    }
}, { timestamps: true })

orderSchema.statics.createOrder = async function (newOrder) {
    const createdOrder = await this.create(newOrder)

    return createdOrder
}

orderSchema.statics.confirmOrder = async function (_id, tenant_id) {
    const confirmedOrder = await this.findOneAndUpdate({ _id, tenant: tenant_id, status: "created" }, { status: "preparing", "progress.preparing": new Date() })

    return confirmedOrder
}

orderSchema.statics.rejectOrder = async function (_id, tenant_id) {
    const rejectedOrder = await this.findOneAndUpdate({ _id, tenant: tenant_id, status: { $in: ["created", "preparing"] } }, { status: "rejected", "progress.rejected": new Date() })

    return rejectedOrder
}

orderSchema.statics.serveOrder = async function (_id, tenant_id) {
    const servedOrder = await this.findOneAndUpdate({ _id, tenant: tenant_id, status: "preparing" }, { status: "ready", "progress.ready": new Date() })

    return servedOrder
}

orderSchema.statics.finishOrder = async function (_id, tenant_id) {
    const completedOrder = await this.findOneAndUpdate({ _id, tenant: tenant_id, status: "ready" }, { status: "completed", "progress.completed": new Date() })

    return completedOrder
}

orderSchema.statics.getSingleOrder = async function (_id, role, user_id) {
    const populateFields = [
        {
            path: 'items.menu',
            select: ['title', 'description', 'image']
        },
        {
            path: 'review',
            select: ['rating', 'content', 'createdAt']
        },
        {
            path: role === 'customer' ? 'tenant' : 'customer',
            select: ['full_name', 'profile_image']
        }
    ];

    const singleOrder = await this.findOne(
        { _id, [role]: user_id },
        { [role]: 0 }
    ).populate(populateFields);

    return singleOrder;
}

const sortFCFS = (a, b) => {
    return moment(a.progress.created).unix() - moment(b.progress.created).unix()
}

const sortSJF = (a, b) => {
    return a.total_prep_duration - b.total_prep_duration
}

orderSchema.statics.getAllOnProgressOrder = async function (role, user_id) {
    const populateFields = [
        {
            path: 'items.menu',
            select: ['title', 'description', 'image']
        },
        {
            path: 'review',
            select: ['rating', 'content']
        },
        {
            path: role === 'customer' ? 'tenant' : 'customer',
            select: ['full_name', 'profile_image']
        }
    ];

    const createdOrder = await this.find(
        {
            [role]: user_id,
            status: "created"
        },
        { [role]: 0 },
    ).populate(populateFields)

    if (createdOrder.length >= 5 ) {
        createdOrder.sort(sortSJF)
    } else {
        createdOrder.sort(sortFCFS)
    }

    const preparingOrder = await this.find(
        {
            [role]: user_id,
            status: "preparing"
        },
        { [role]: 0 },
    ).populate(populateFields).sort({ "progress.preparing": 1 });

    const readyOrder = await this.find(
        {
            [role]: user_id,
            status: "ready"
        },
        { [role]: 0 },
    ).populate(populateFields).sort({ "progress.ready": 1 });

    const allOrder = {
        created: createdOrder,
        preparing: preparingOrder,
        ready: readyOrder
    };

    return allOrder;
}


orderSchema.statics.getAllOrder = async function (role, user_id) {
    const populateFields = [
        {
            path: 'items.menu',
            select: ['title', 'description', 'image']
        },
        {
            path: 'review',
            select: ['rating', 'content']
        },
        {
            path: role === 'customer' ? 'tenant' : 'customer',
            select: ['full_name', 'profile_image']
        }
    ];

    const allOrder = await this.find({ [role]: user_id }, { [role]: 0 })
        .populate(populateFields)
        .sort({ "progress.created": -1 });

    return allOrder;
}

export default mongoose.model("Order", orderSchema)