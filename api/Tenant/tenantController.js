import responseParser from "../../helper/responseParser.js"
import uploadToBucket from "../../helper/uploadToBucket.js"
import Tenant from "./tenantModel.js"
import Customer from "../Customer/customerModel.js";
import Menu from "../Menu/menuModel.js";
import Review from "../Review/reviewModel.js";
import bcrypt from "bcrypt"
import errorHandler from "../../helper/errorHandler.js";
import mongoose from "mongoose";
import isEmailExist from "../../helper/isEmailExist.js";
import moment from "moment";

const editProfile = async (req, res) => {
    try {
        const { _id } = req.user
        const { full_name, location, description, email } = req.body

        if (await isEmailExist(email)) {
            throw Error("Email already used||409")
        }

        const data = { full_name, location, email, description }

        await Tenant.findByIdAndUpdate(_id, data)
        return responseParser({ status: 200 }, res)
    } catch (err) {
        console.log(err)
        return responseParser({ status: 404 }, res)
    }
}

const register = async (req, res) => {
    const { email, password, full_name, description, location } = req.body

    try {
        const emailExistCustomer = await Tenant.findOne({ email })
        const emailExistTenant = await Customer.findOne({ email })

        if (emailExistCustomer || emailExistTenant) {
            throw Error("Email is already registered||409")
        }

        const passwordSalt = await bcrypt.genSalt(5)
        const passwordHash = await bcrypt.hash(password, passwordSalt)

        const newTenant = await Tenant.register({ email, password: passwordHash, full_name, description, location })

        return responseParser({
            data: {
                email: newTenant.email,
                full_name: newTenant.full_name
            },
            message: "New tenant created"
        }, res)
    } catch (err) {
        return errorHandler(err, res)
    }
}

const getProfile = async (req, res) => {
    try {
        const { _id } = req.user
        const tenant = await Tenant.findById(_id, ["email", "full_name", "location", "description", "profile_image"])

        if (!tenant) {
            throw Error ("Tenant not found||404")
        }

        return responseParser({ status: 200, data: tenant }, res)
    } catch (err) {
        return errorHandler(err, res)
    }
}

const getDetail = async (req, res) => {
    try {
        const { _id } = req.params

        const tenant = await Tenant
            .findById(_id, [
                "profile_image",
                "full_name",
                "description",
                "label",
                "location",
                "is_open",
            ])

        if (!tenant) throw Error("||404")

        const tenant_menu = await Menu.aggregate([
            {
                $match: {
                    tenant: mongoose.Types.ObjectId(_id),
                }
            },
            {
                $lookup: {
                    from: "menucategories", // Replace with the actual name of your categories collection
                    localField: "category",
                    foreignField: "_id",
                    as: "category"
                }
            },
            {
                $unwind: {
                    path: "$category",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $group: {
                    _id: "$category",
                    menu: {
                        $push: {
                            _id: "$_id",
                            title: "$title",
                            description: "$description",
                            image: "$image",
                            price: "$price"
                        }
                    }
                }
            },
            {
                $project: {
                    category: {
                        $ifNull: [
                            { _id: "$_id._id", title: "$_id.title" },
                            null
                        ]
                    },
                    menu: 1,
                    _id: 0
                }
            }, {
                $sort: { "category.title": -1 },
            },
        ])

        const reviews = await Review
            .find({ tenant: _id }, { tenant: 0 })
            .populate("customer", ["full_name", "profile_image"])

        const rating = reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length || 0
        const total_review = reviews.length

        const respData = await { ...tenant._doc, tenant_menu, reviews, rating, total_review }

        return responseParser({ status: 200, data: respData }, res)
    } catch (err) {
        return errorHandler(err, res)
    }
}
const getAll = async (_, res) => {
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
                $project: {
                    _id: 1,
                    full_name: 1,
                    description: 1,
                    location: 1,
                    profile_image: 1,
                    total_review: { $size: '$reviews' },
                    rating: { $ifNull: [{ $avg: '$reviews.rating' }, 0] }
                }
            }
        ])

        if (!allTenant) throw Error

        return responseParser({ status: 200, data: allTenant }, res)
    } catch (err) {
        return responseParser({ status: 404 }, res)
    }
}

const editProfileImage = async (req, res) => {
    try {
        const { _id } = req.user
        const { profile_image } = await Tenant.findById(_id, ["profile_image"])

        const url = await uploadToBucket({ req, currentUrl: profile_image })
        const newProfileImage = url
        await Tenant.findByIdAndUpdate(_id, { profile_image: newProfileImage })

        return responseParser({ status: 200 }, res)
    } catch (err) {
        return errorHandler(err, res)
    }
}

const changePassword = async (req, res) => {
    try {
        const { password, new_password, confirm_new_password } = req.body
        const { _id } = req.user

        if (new_password !== confirm_new_password) {
            throw Error("New password and confirm new password must be the same||400")
        }

        const tenant = await Tenant.findById(_id, ["password"])

        if (!tenant) {
            throw Error("Tenant not found||404")
        }

        const isCorrectPassword = await bcrypt.compare(password, tenant?.password)

        if (!isCorrectPassword) {
            throw Error("Old password is incorrect||400")
        }

        const hashedNewPassword = await bcrypt.hash(new_password, 5)

        await Tenant.findByIdAndUpdate(_id, { password: hashedNewPassword })

        return responseParser({ status: 200 }, res)
    } catch (err) {
        return errorHandler(err, res)
    }
}

const dashboard = async (req, res) => {
    try {
        const { _id } = req.user

        const tenant = await Tenant.aggregate([
            {
                $match: {
                    _id: mongoose.Types.ObjectId(_id)
                }
            },
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
                    from: "orders",
                    localField: "_id",
                    foreignField: "tenant",
                    as: "orders"
                }
            },
            {
                $project: {
                    _id: 1,
                    full_name: 1,
                    email: 1,
                    profile_image: 1,
                    description: 1,
                    balance: 1,
                    total_order: { $size: '$orders' },
                    total_order_today: {
                        $size: {
                            $filter: {
                                input: "$orders",
                                as: "order",
                                cond: {
                                    $and: [
                                        { $gte: ["$$order.createdAt", moment().startOf('day').toDate()] },
                                        { $lt: ["$$order.createdAt", moment().endOf('day').toDate()] }
                                    ]
                                }
                            }
                        }
                    },
                    rating: { $ifNull: [{ $avg: '$reviews.rating' }, 0] },
                    total_review: { $size: '$reviews' },
                }
            }
        ])

        if (!tenant) throw Error("||404")

        return responseParser({ status: 200, data: tenant[0] }, res)
    } catch (err) {
        return errorHandler(err, res)
    }
}

const getAllPreview = async (req, res) => {
    try {
        const { _id } = req.user
        const allReview = await Review.find({ tenant: _id }, { tenant: 0 })
            .populate("customer", ["full_name", "profile_image"])
            .sort({ createdAt: -1 })

        const reviewSummary = await Review.aggregate([
            {
                $match: {
                    tenant: mongoose.Types.ObjectId(_id)
                }
            },
            {
                $group: {
                    _id: null,
                    total_review: { $sum: 1 },
                    average_rating: { $avg: "$rating" },
                    total_5_rating: { $sum: { $cond: [{ $eq: ["$rating", 5] }, 1, 0] } },
                    total_4_rating: { $sum: { $cond: [{ $eq: ["$rating", 4] }, 1, 0] } },
                    total_3_rating: { $sum: { $cond: [{ $eq: ["$rating", 3] }, 1, 0] } },
                    total_2_rating: { $sum: { $cond: [{ $eq: ["$rating", 2] }, 1, 0] } },
                    total_1_rating: { $sum: { $cond: [{ $eq: ["$rating", 1] }, 1, 0] } },
                }
            }
        ])

        return responseParser({ status: 200, data: { reviews: allReview, ...reviewSummary[0] } }, res)

            } catch (err) {
                return errorHandler(err, res)
            }
    }

export default {
        editProfile,
        getProfile,
        register,
        getDetail,
        getAll,
        editProfileImage,
        changePassword,
        dashboard,
        getAllPreview
    }