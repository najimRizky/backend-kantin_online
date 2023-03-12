import mongoose from "mongoose"
import nullRefIdParser from "../../config/nullRefIdParser.js"
import responseParser from "../../helper/responseParser.js"
import uploadToBucket from "../../helper/uploadToBucket.js"
import Menu from "./menuModel.js"
import Tenant from "./../Tenant/tenantModel.js"

const editMenu = async (req, res) => {
    try {
        const { _id } = req.user
        const menuId = req.params._id

        const { title, description, category, price, prep_duration } = req.body

        const data = {
            title,
            description,
            category: nullRefIdParser(category),
            price,
            prep_duration,
        }

        if (req.file) {
            const { image } = await Menu.findById(menuId, ["image"])
            const url = await uploadToBucket({ req, currentUrl: image })
            data.image = url
        }

        await Menu.findByIdAndUpdate(menuId, data, { tenant: _id })

        return responseParser({ status: 200, data: newMenu }, res)
    } catch (err) {
        return responseParser({ status: 404 }, res)
    }
}

const getDetail = async (req, res) => {
    try {
        const { _id } = req.params

        const menu = await Menu.findById(_id).populate("tenant", "full_name description location")

        return responseParser({ status: 200, data: menu }, res)
    } catch (err) {
        return responseParser({ status: 404 }, res)
    }
}

const addMenu = async (req, res) => {
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const { _id } = req.user
        const { title, description, category, price, prep_duration } = req.body
        const data = {
            title,
            description,
            category: nullRefIdParser(category),
            price,
            prep_duration,
            tenant: mongoose.Types.ObjectId(_id)
        }

        if (req.file) {
            const url = await uploadToBucket({ req, currentUrl: "" })
            data.image = url
        }

        const newMenu = await Menu.addMenu(_id, data)
        await Tenant.addMenu({ _id, newMenuId: newMenu._id })

        await session.commitTransaction()

        return responseParser({ status: 200, data: newMenu }, res)
    } catch (err) {
        await session.abortTransaction();
        return responseParser({ status: 400 }, res)
    } finally {
        session.endSession()
    }
}

export default {
    editMenu,
    getDetail,
    addMenu
}