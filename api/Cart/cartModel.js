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

cartSchema.statics.clearCart = async function ({ tenant_id, customer_id }) {
    const clearedCart = await this.deleteOne({
        customer: customer_id,
        tenant: tenant_id
    })

    return clearedCart
}

cartSchema.statics.addItemQuantity = async function ({ tenant_id, customer_id, menu_id, quantity }) {
    const updateCart = await this.updateOne({
        tenant: tenant_id,
        customer: customer_id,
        "items.menu": menu_id,
    }, {
        $inc: { "items.$.quantity": quantity }
    })

    return updateCart
}

cartSchema.statics.updateItemQuantity = async function ({ tenant_id, customer_id, menu_id, quantity }) {
    const updateCart = await this.updateOne({
        tenant: tenant_id,
        customer: customer_id,
        "items.menu": menu_id,
    }, {
        $set: { "items.$.quantity": quantity }
    })

    return updateCart
}

cartSchema.statics.addNewItem = async function ({ tenant_id, customer_id, menu_id, quantity }) {
    const newItem = await this.updateOne({
        tenant: tenant_id,
        customer: customer_id,
    }, {
        $push: { "items": { menu: mongoose.Types.ObjectId(menu_id), quantity: quantity } }
    })

    return newItem
}

cartSchema.statics.removeItem = async function ({ tenant_id, customer_id, menu_id }) {
    const removedItem = await this.updateOne({
        tenant: tenant_id,
        customer: customer_id,
        "items.menu": menu_id
    }, {
        $pull: { items: { menu: menu_id } }
    })

    return removedItem
}

cartSchema.statics.createCart = async function ({ tenant_id, customer_id, menu_id, quantity }) {
    const newCart = await this.create({
        tenant: tenant_id,
        customer: customer_id,
        items: [{
            menu: menu_id,
            quantity: quantity
        }]
    })

    return newCart
}

cartSchema.statics.getSingleCartSingleItem = async function ({ tenant_id, customer_id, menu_id }) {
    const singleCartSingleItem = await this.findOne({
        tenant: tenant_id,
        customer: customer_id,
        "items.menu": menu_id
    })

    return singleCartSingleItem
}

cartSchema.statics.getSingleCartItem = async function ({ tenant_id, customer_id }) {
    const singleCartItem = await this.findOne({
        tenant: tenant_id,
        customer: customer_id,
    }, ["items"])

    return singleCartItem
}

cartSchema.statics.getSingleCart = async function ({ tenant_id, customer_id }) {
    const singleCart = await this
        .findOne({ tenant: tenant_id, customer: customer_id }, {
            customer: 0
        })
        .populate("tenant", [
            "full_name",
            "profile_image"
        ])
        .populate("items.menu", [
            "title",
            "description",
            "image",
            "price"
        ])

    return singleCart
}

cartSchema.statics.getAllCart = async function ({ customer_id }) {
    const allCart = await this
        .find({ customer: customer_id }, {
            customer: 0
        })
        .populate("tenant", [
            "full_name",
            "profile_image"
        ])
        .populate("items.menu", [
            "title",
            "description",
            "image",
            "price"
        ])

    return allCart
}

export default mongoose.model("Cart", cartSchema)