import errorHandler from "../../helper/errorHandler.js"
import responseParser from "../../helper/responseParser.js"
import Customer from "../Customer/customerModel.js"
import Tenant from "../Tenant/tenantModel.js"
import Menu from "../Menu/menuModel.js"
import Order from "../Order/orderModel.js"
import uploadToBucket from "../../helper/uploadToBucket.js"

const ADMIN_EMAIL = process.env.MAIL_EMAIL

const registerTenant = async (req, res) => {
    const { email, full_name, description, location, password } = req.body

    try {
        const customerExist = await Customer.findOne({ email })
        const tenantExist = await Tenant.findOne({ email })
        const adminExist = email === ADMIN_EMAIL

        if (customerExist || tenantExist || adminExist) {
            throw Error("Email already registered||409")
        }

        const tenant = await Tenant.create({
            email,
            full_name,
            description,
            location,
            password
        })
        return responseParser({ status: 201, data: tenant }, res)
    } catch (err) {
        return errorHandler(err, res)
    }
}

const allTenant = async (req, res) => {
    try {
        const allTenant = await Tenant.aggregate([
            {
                $lookup: {
                    from: 'reviews',
                    localField: '_id',
                    foreignField: 'tenant',
                    as: 'reviews'
                }
            },
            {
                $lookup: {
                    from: 'orders',
                    localField: '_id',
                    foreignField: 'tenant',
                    as: 'orders'
                }
            },
            {
                $lookup: {
                    from: 'menus',
                    localField: '_id',
                    foreignField: 'tenant',
                    as: 'menus'
                }
            },
            {
                $project: {
                    _id: 1,
                    full_name: 1,
                    description: 1,
                    location: 1,
                    profile_image: 1,
                    email: 1,
                    total_review: { $size: '$reviews' },
                    rating: { $ifNull: [{ $avg: '$reviews.rating' }, 0] },
                    total_order: { $size: '$orders' },
                    total_menu: { $size: '$menus' }
                }
            }
        ])
        return responseParser({ status: 200, data: allTenant }, res)
    } catch (err) {
        return errorHandler(err, res)
    }
}

const detailTenant = async (req, res) => {
    try {
        const { _id } = req.params

        const tenant = await Tenant.findOne({
            _id: _id,
        }, [
            "full_name",
            "description",
            "location",
            "profile_image",
            "email"
        ])
        const menus = await Menu.find({ tenant: _id }).populate("category", ["title"])
        const orders = await Order.find({ tenant: _id })
            .populate("customer", ["full_name"])
            .populate("items.menu", ["title"])
            .populate("review", ["rating", "content"])

        const data = {
            ...tenant._doc,
            menus,
            orders
        }

        return responseParser({ status: 200, data }, res)
    } catch (err) {
        return errorHandler(err, res)
    }
}

const editTenant = async (req, res) => {
    try {
        const { _id } = req.params
        const { full_name, description, location, email } = req.body

        const data = {
            full_name,
            description,
            location,
            email,
        }

        if (req.file) {
            const { profile_image } = await Tenant.findById(_id, ["profile_image"])
            const newUrl = await uploadToBucket({ req, currentUrl: profile_image })
            data.profile_image = newUrl
        }

        const editedTenant = await Tenant.findOneAndUpdate({
            _id: _id,
        }, data)

        if (!editedTenant) throw Error("Tenant not found||404")

        return responseParser({ status: 200 }, res)
    } catch (err) {
        return errorHandler(err, res)
    }
}

const deleteTenant = async (req, res) => {
    try {
        const { _id } = req.params
        const deletedTenant = await Tenant.findOneAndUpdate({
            _id: _id,
        }, { is_deleted: true })

        if (!deletedTenant) throw Error("Tenant not found||404")

        return responseParser({ status: 200 }, res)
    } catch (err) {
        return errorHandler(err, res)
    }
}

const allCustomer = async (req, res) => {
    try {
        const allCustomer = await Customer.aggregate([
            {
                $lookup: {
                    from: 'orders',
                    localField: '_id',
                    foreignField: 'customer',
                    as: 'orders'
                }
            },
            {
                $lookup: {
                    from: 'reviews',
                    localField: '_id',
                    foreignField: 'customer',
                    as: 'reviews'
                }
            },
            {
                $project: {
                    _id: 1,
                    full_name: 1,
                    email: 1,
                    profile_image: 1,
                    total_order: { $size: '$orders' },
                    total_review: { $size: '$reviews' },
                }
            }
        ])

        return responseParser({ status: 200, data: allCustomer }, res)
    } catch (err) {
        return errorHandler(err, res)
    }
}

const detailCustomer = async (req, res) => {
    try {
        const { _id } = req.params
        const customer = await Customer.findById(_id, {
            password: 0,
            __v: 0,
            confirmation_token: 0,
            confirmed: 0,
            reset_password_token: 0,
        })

        const orders = await Order.find({ customer: _id })
            .populate("tenant", ["full_name", "profile_image"])
            .populate("items.menu", ["title"])
            .populate("review", ["rating", "content"])

        const data = {
            ...customer._doc,
            orders
        }

        return responseParser({ status: 200, data }, res)
    } catch (err) {
        return errorHandler(err, res)
    }
}

const allOrder = async (_, res) => {
    try {
        const allOrder = await Order.find()
            .populate("tenant", ["full_name", "profile_image"])
            .populate("customer", ["full_name"])
            .populate("items.menu", ["title"])
            .populate("review", ["rating", "content"])

        return responseParser({ status: 200, data: allOrder }, res)
    } catch (err) {
        return errorHandler(err, res)
    }
}

const allMenu = async (req, res) => {
    try {
        const allMenu = await Menu.find()
        .populate("category", ["title"])
        .populate("tenant", ["full_name"])
        
        return responseParser({ status: 200, data: allMenu }, res)
    } catch (err) {
        return errorHandler(err, res)
    }
}

const editMenu = async (req, res) => {
    try {
        const { _id } = req.params
        const { title, description, price, category } = req.body

        const data = {
            title,
            description,
            price,
            category
        }

        if (req.file) {
            const { image } = await Menu.findById(_id, ["image"])
            const newUrl = await uploadToBucket({ req, currentUrl: image })
            data.image = newUrl
        }

        const editedMenu = await Menu.findOneAndUpdate({
            _id: _id,
        }, data)

        if (!editedMenu) throw Error("Menu not found||404")

        return responseParser({ status: 200 }, res)
    } catch (err) {
        return errorHandler(err, res)
    }
}

export default {
    registerTenant,
    allTenant,
    detailTenant,
    editTenant,
    deleteTenant,

    allCustomer,
    detailCustomer,

    allOrder,

    allMenu,
    editMenu
}