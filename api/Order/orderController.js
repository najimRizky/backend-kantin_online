import mongoose from "mongoose"
import errorHandler from "../../helper/errorHandler.js"
import responseParser from "../../helper/responseParser.js"
import Cart from "./../Cart/cartModel.js"
import Order from "./orderModel.js"

const createOrder = async (req, res) => {
    const session = await mongoose.startSession()
    try {
        session.startTransaction()

        const { cart_id, payment_method } = req.body

        const cart = await Cart.findById(cart_id).populate("items.menu")
        if (!cart) throw Error("||404")

        const newOrder = {
            customer: cart.customer,
            tenant: cart.tenant,
            items: cart.items.map((item) => ({
                menu: item.menu._id,
                quantity: item.quantity,
                price: item.menu.price
            })),
            status: "pending",
            total_price: calculateTotalPrice(cart.items),
            payment_method: payment_method
        }
        const createdOrder = await Order.createOrder(newOrder)
        await Cart.clearCartById(cart_id)

        await session.commitTransaction()
        session.endSession()

        await Order.findByIdAndUpdate((createdOrder._doc._id).toString(), { cancel_id: tesTimer })

        return responseParser({ data: createdOrder }, res)
    } catch (err) {
        await session.abortTransaction()
        session.endSession()

        return errorHandler(err, res)
    }
}

const confirmOrder = async (req, res) => {
    const { _id } = req.params
    const order = await Order.findById(_id)

    clearTimeout(order.cancel_id)

    res.send("anjas")
}

const calculateTotalPrice = (items) => {
    let totalPrice = 0

    items.map((item) => {
        totalPrice += (item.quantity * item.menu.price)
    })

    return totalPrice
}

export default {
    createOrder,
    confirmOrder
}