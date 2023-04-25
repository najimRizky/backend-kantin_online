import { isNotDeleted } from "../../config/queryConfig.js"
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
                { $or: isNotDeleted }
            ]
        }, [
            "title",
            "description",
            "tenant",
            "image",
            "price",
        ]);
        
        const tenant = await Tenant.find({
            $or: [
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

export default {
    search
}