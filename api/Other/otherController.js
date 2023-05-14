import errorHandler from "../../helper/errorHandler.js"
import responseParser from "../../helper/responseParser.js"
import Menu from "./../Menu/menuModel.js"
import Tenant from "./../Tenant/tenantModel.js"

const search = async (req, res) => {
    try {
        const { q } = req.query
        if (!q) throw Error("||400")

        const menu = await Menu.find({
            $and: [
                {
                    $or: [
                        { title: { $regex: q, $options: 'i' } },
                        { description: { $regex: q, $options: 'i' } }
                    ]
                },
            ]
        }, [
            "title",
            "description",
            "tenant",
            "image",
            "price",
        ]);
        
        const tenant = await Tenant.find({
            $and: [
                { full_name: { $regex: q, $options: 'i' } },
            ]
        }, [
            "full_name",
            "description",
            "location",
            "avg_score",
            "profile_image",
            "is_open",
        ]);

        return responseParser({ status: 200, data: { menu, tenant } }, res)
    } catch (err) {
        return errorHandler(err, res)
    }
}

const randomMenu = async (req, res) => {
    try {
        const menu = await Menu.aggregate([
            { $sample: { size: 10 } },
            {
                $lookup: {
                    from: "tenants",
                    localField: "tenant",
                    foreignField: "_id",
                    as: "tenant"
                }
            },
            { $unwind: "$tenant" },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    description: 1,
                    image: 1,
                    price: 1,
                    is_available: 1,
                    tenant: {
                        _id: 1,
                        full_name: 1,
                        description: 1,
                        location: 1,
                        avg_score: 1,
                        profile_image: 1,
                        is_open: 1,
                    }
                }
            }
        ])

        return responseParser({ status: 200, data: menu }, res)
    } catch (err) {
        return errorHandler(err, res)
    }
}

const randomTenant = async (req, res) => {
    try {
        const tenant = await Tenant.aggregate([
            { $sample: { size: 10 } },
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

        return responseParser({ status: 200, data: tenant }, res)
    } catch (err) {
        return errorHandler(err, res)
    }
}


export default {
    search,
    randomMenu,
    randomTenant
}