import responseParser from "../../helper/responseParser.js"
import Menu from "./../Menu/menuModel.js"
import Tenant from "./../Tenant/tenantModel.js"

const search = async (req, res) => {
    try {
        const { q } = req.query
        if (!q) throw Error(400)

        const menu = await Menu.find({
            $or: [
                { name: { $regex: q, $options: 'i' } },
                { description: { $regex: q, $options: 'i' } },
            ], 
            is_deleted: false
        }, [
            "title",
            "description",
            "tenant",
            "image",
            "price",
        ]
        );
        const tenant = await Tenant.find({
            $or: [
                { name: { $regex: q, $options: 'i' } },
                { description: { $regex: q, $options: 'i' } },
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
        if (err.message == 400) {
            return responseParser({ status: 400, error: "Query is required" }, res)
        } else {
            return responseParser({ status: 404 }, res)
        }
    }
}

export default {
    search
}