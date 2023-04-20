import errorHandler from "../../helper/errorHandler.js"
import responseParser from "../../helper/responseParser.js"
import Customer from "../Customer/customerModel.js"
import Tenant from "../Tenant/tenantModel.js"

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

export default {
    registerTenant,
    allTenant
}