import mongoose from "mongoose"
import errorHandler from "../../helper/errorHandler.js"
import responseParser from "../../helper/responseParser.js"
import scheduler from "../../server/scheduler.js"

import Cart from "./../Cart/cartModel.js"
import Order from "./orderModel.js"
import Customer from "./../Customer/customerModel.js"
import Review from "./../Review/reviewModel.js"
import Tenant from "./../Tenant/tenantModel.js"

const createOrder = async (req, res) => {
    const session = await mongoose.startSession()
    try {
        session.startTransaction()

        const { cart_id } = req.body
        const customer_id = req.user._id

        const cart = await Cart.findOne({ _id: cart_id, customer: customer_id }).populate("items.menu")
        if (!cart) throw Error("||404")

        const allMenuAvailable = cart.items.every((item) => item.menu.is_available)
        if (!allMenuAvailable) throw Error("Some menu not available||400")

        const totalPrice = calculateTotalPrice(cart.items)
        const totalPrepDuration = calculateTotalPrepDuration(cart.items)
        const customerBalance = await Customer.findById(customer_id, ["balance"])

        if (customerBalance.balance < totalPrice) throw Error("Not enough balance||402")

        const newOrder = {
            customer: cart.customer,
            tenant: cart.tenant,
            items: cart.items.map((item) => ({
                menu: item.menu._id,
                quantity: item.quantity,
                price: item.menu.price
            })),
            status: "created",
            total_price: totalPrice,
            total_prep_duration: totalPrepDuration,
        }
        const createdOrder = await Order.createOrder(newOrder)
        await Cart.clearCartById(cart_id)
        await Customer.reduceBalance(customer_id, totalPrice)
        
        scheduler.assignAutoRejectOrder(createdOrder._id, cart.tenant, createdOrder.progress.created)

        await session.commitTransaction()
        session.endSession()

        await req.app
        .get("socketService")
        .emiter({
            event: `tenant/update/${cart.tenant}`, 
            url: "/order/on-progress",
            message: "Ada Pesanan Baru"
        })

        return responseParser({ data: createdOrder }, res)
    } catch (err) {
        await session.abortTransaction()
        session.endSession()

        return errorHandler(err, res)
    }
}

const confirmOrder = async (req, res) => {
    try {
        const { _id } = req.params
        const tenant_id = req.user._id

        const confirmedOrder = await Order.confirmOrder(_id, tenant_id)

        if (!confirmedOrder) throw Error("||404")

        scheduler.removeAutoRejectOrder(_id)

        await req.app
        .get("socketService")
        .emiter({
            event: `customer/update/${confirmedOrder.customer}`, 
            url: ["/order/", `/order/${_id}`],
            message: "Order Confirmed!"
        })

        return responseParser({ status: 200 }, res)
    } catch (err) {
        return errorHandler(err, res)
    }
}

const rejectOrder = async (req, res) => {
    const session = await mongoose.startSession()
    try {
        session.startTransaction()

        const { _id } = req.params
        const tenant_id = req.user._id

        const rejectedOrder = await Order.rejectOrder(_id, tenant_id)

        if (!rejectedOrder) throw Error("||404")

        const updatedCustomerBalance = await Customer.addBalance(rejectedOrder.customer, rejectedOrder.total_price)

        if (!updatedCustomerBalance) throw Error("||404")

        await session.commitTransaction()
        session.endSession()

        await req.app
        .get("socketService")
        .emiter({
            event: `customer/update/${rejectedOrder.customer}`, 
            url: ["/order/", `/order/${_id}`],
            message: "Order Rejected!",
            severity: "error"
        })

        return responseParser({ status: 200 }, res)
    } catch (err) {
        await session.abortTransaction()
        session.endSession()
        
        return errorHandler(err, res)
    }
}

const serveOrder = async (req, res) => {
    try {
        const { _id } = req.params
        const tenant_id = req.user._id

        const servedOrder = await Order.serveOrder(_id, tenant_id)

        if (!servedOrder) throw Error("||404")
        
        await req.app
        .get("socketService")
        .emiter({
            event: `customer/update/${servedOrder.customer}`, 
            url: ["/order/", `/order/${_id}`],
            message: "Order is Ready to take!",
            severity: "warning"
        })

        return responseParser({ status: 200 }, res)
    } catch (err) {
        return errorHandler(err, res)
    }
}

const finishOrder = async (req, res) => {
    const session = await mongoose.startSession()
    try {
        session.startTransaction()

        const { _id } = req.params
        const tenant_id = req.user._id

        const completedOrder = await Order.finishOrder(_id, tenant_id)

        if (!completedOrder) throw Error("||404")

        await Tenant.addBalance(tenant_id, completedOrder.total_price)

        await session.commitTransaction()
        session.endSession()

        await req.app
        .get("socketService")
        .emiter({
            event: `customer/update/${completedOrder.customer}`, 
            url: ["/order/", `/order/${_id}`],
            message: "Order Completed!, Please give a review",
            severity: "success"
        })

        return responseParser({ status: 200 }, res)
    } catch (err) {
        await session.commitTransaction()
        session.endSession()

        return errorHandler(err, res)
    }
}

const getAllOnProgressOrder = async (req, res) => {
    try {
        const user_id = req.user._id //Tenant or Customer
        const role = req.user.role //Tenant or Customer

        const orders = await Order.getAllOnProgressOrder(role, user_id)

        return responseParser({ status: 200, data: orders }, res)
    } catch (err) {
        return errorHandler(err, res)
    }
}

const getAllOrder = async (req, res) => {
    try {
        const user_id = req.user._id //Tenant or Customer
        const role = req.user.role //Tenant or Customer

        const orders = await Order.getAllOrder(role, user_id)

        return responseParser({ status: 200, data: orders }, res)
    } catch (err) {
        return errorHandler(err, res)
    }
}

const getSingleOrder = async (req, res) => {
    try {
        const user_id = req.user._id //Tenant or Customer
        const role = req.user.role //Tenant or Customer
        const { _id } = req.params

        const order = await Order.getSingleOrder(_id, role, user_id)

        if (!order) throw Error("||404")

        return responseParser({ status: 200, data: order }, res)
    } catch (err) {
        return errorHandler(err, res)
    }
}

const addReview = async (req, res) => {
    const session = await mongoose.startSession()
    try {
        session.startTransaction()

        const customer_id = req.user._id
        const { _id } = req.params
        const { rating, content } = req.body

        const filter = {
            _id: _id,
            customer: customer_id,
            status: "completed",
            review: null
        }

        const order = await Order.findOne(filter)

        console.log(order, filter)
        if (!order) throw Error("||404")


        const tenant_id = order.tenant

        const newReview = {
            customer: customer_id,
            tenant: tenant_id,
            rating: rating,
            content: content
        }

        const review = await Review.create(newReview)
        await Order.findByIdAndUpdate(_id, { $set: { review: review._id } })

        await session.commitTransaction()
        session.endSession()

        return responseParser({ status: 200 }, res)
    } catch (err) {
        await session.abortTransaction()
        session.endSession()

        return errorHandler(err, res)
    }
}

const calculateTotalPrice = (items) => {
    let totalPrice = 0

    items.map((item) => {
        totalPrice += (item.quantity * item.menu.price)
    })

    return totalPrice
}

const calculateTotalPrepDuration = (items) => {
    let totalPrepDuration = 0

    items.map((item) => {
        totalPrepDuration += (item.quantity * item.menu.prep_duration)
    })

    return totalPrepDuration
}

export default {
    createOrder,
    confirmOrder,
    rejectOrder,
    serveOrder,
    finishOrder,
    getAllOnProgressOrder,
    getAllOrder,
    getSingleOrder,
    addReview
}