import mongoose from "mongoose"
import responseParser from "../../helper/responseParser.js"
import Cart from "./cartModel.js"

const addItem = async (req, res) => {
    try {
        const userId = req.user._id
        const { tenant_id, menu_id, quantity } = req.body

        const cart = await Cart.findOne({
            tenant: tenant_id,
            customer: userId,
        })

        if (cart) {
            const cartTenant = await Cart.findOne({
                tenant: tenant_id,
                customer: userId,
                "items.menu": menu_id
            })

            if (cartTenant) {
                await Cart.updateOne({
                    tenant: tenant_id,
                    customer: userId,
                    "items.menu": menu_id,
                }, {
                    $inc: { "items.$.quantity": quantity }
                })
            } else {
                await Cart.updateOne({
                    tenant: tenant_id,
                    customer: userId,
                }, {
                    $push: { "items": { menu: mongoose.Types.ObjectId(menu_id), quantity: quantity } }
                })
            }
        } else {
            await Cart.create({
                tenant: tenant_id,
                customer: userId,
                items: [{
                    menu: menu_id,
                    quantity: quantity
                }]
            })
        }

        return responseParser({ status: 200 }, res)
    } catch (err) {
        return responseParser({ status: 500 }, res)
    }
}

const updateItem = async (req, res) => {
    /** @Todo Update Cart Logic */
    return res.send("Update Item")
}

const removeItem = async (req, res) => {
    /** @Todo Delete Cart Logic */
    return res.send("Remove Item")
}

const clearCart = async (req, res) => {
    /** @Todo Delete Cart Logic */
    return res.send("Clear Cart")
}

const getCart = async (req, res) => {
    try {
        const { _id } = req.params
        const cart = await Cart
            .findById(_id, {
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

        if (!cart) throw Error
        else {
            let total = 0
            cart.items.map((item) => {
                total += item.quantity * item.menu.price
            })
            cart._doc.total = total
        }

        return responseParser({ status: 200, data: cart }, res)

    } catch (err) {
        return responseParser({ status: 404 }, res)
    }
}

const getAllCart = async (req, res) => {
    const userId = req.user._id
    try {
        const carts = await Cart
            .find({ customer: userId }, {
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

        const cartWithTotal = carts

        if (carts) {
            carts.map((cart, i) => {
                let total = 0
                cart.items.map((item) => {
                    total += item.quantity * item.menu.price
                })
                carts[i]._doc.total = total
            })
        }

        return responseParser({ status: 200, data: cartWithTotal }, res)
    } catch (err) {
        return responseParser({ status: 404 }, res)
    }
}

export default {
    addItem,
    updateItem,
    removeItem,
    clearCart,
    getCart,
    getAllCart,
}