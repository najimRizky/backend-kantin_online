import responseParser from "../../helper/responseParser.js"
import Cart from "./cartModel.js"
import Menu from "./../Menu/menuModel.js"
import errorHandler from "../../helper/errorHandler.js"

const addItem = async (req, res) => {
    try {
        const customer_id = req.user._id
        const { tenant_id } = req.params
        const { menu_id, quantity } = req.body

        const menu = await Menu.findOne({ _id: menu_id, tenant: tenant_id })

        if (!menu) throw Error("||404")

        const cart = await Cart.findOne({
            tenant: tenant_id,
            customer: customer_id,
        })

        if (cart) {
            const cartTenant = await Cart.getSingleCartSingleItem({ tenant_id, customer_id, menu_id })

            if (cartTenant) {
                await Cart.addItemQuantity({ tenant_id, customer_id, menu_id, quantity })
            } else {
                await Cart.addNewItem({ tenant_id, customer_id, menu_id, quantity })
            }
        } else {
            await Cart.createCart({ tenant_id, customer_id, menu_id, quantity })
        }

        return responseParser({ status: 200 }, res)
    } catch (err) {
        return errorHandler(err, res)
    }
}

const updateItem = async (req, res) => {
    try {
        const customer_id = req.user._id
        const { tenant_id } = req.params
        const { menu_id, quantity } = req.body

        await Cart.updateItemQuantity({ tenant_id, customer_id, menu_id, quantity })

        const updatedCart = await Cart.getSingleCartSingleItem({ tenant_id, customer_id, menu_id })

        if (updatedCart.items[0].quantity === 0) {
            await Cart.removeItem({ tenant_id, customer_id, menu_id })
        }

        const updatedCart2 = await Cart.getSingleCartItem({ tenant_id, customer_id })

        if (updatedCart2.items.length === 0) {
            await Cart.clearCart({ customer_id, tenant_id })
        }

        return responseParser({ status: 200 }, res)
    } catch (err) {
        return responseParser({ status: 404 }, res)
    }
}

const removeItem = async (req, res) => {
    try {
        const customer_id = req.user._id
        const { tenant_id } = req.params
        const { menu_id } = req.body

        await Cart.removeItem({ tenant_id, customer_id, menu_id })

        const updatedCart = await Cart.getSingleCartItem({ tenant_id, customer_id })

        if (updatedCart.items.length === 0) {
            await Cart.clearCart({ customer_id, tenant_id })
        }

        return responseParser({ status: 200 }, res)
    } catch (err) {
        return responseParser({ status: 404 }, res)
    }
}

const clearCart = async (req, res) => {
    try {
        const customer_id = req.user._id
        const { tenant_id } = req.params

        await Cart.clearCart({ customer_id, tenant_id })

        return responseParser({ status: 200 }, res)
    } catch (err) {
        return responseParser({ status: 404 }, res)
    }
}

const getCart = async (req, res) => {
    try {
        const customer_id = req.user._id
        const { tenant_id } = req.params
        const cart = await Cart.getSingleCart({ tenant_id, customer_id })

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
    const customer_id = req.user._id
    try {
        const carts = await Cart.getAllCart({ customer_id })

        if (carts) {
            carts.map((cart, i) => {
                let total = 0
                cart.items.map((item) => {
                    total += item.quantity * item.menu.price
                })
                carts[i]._doc.total = total
            })
        }

        return responseParser({ status: 200, data: carts }, res)
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