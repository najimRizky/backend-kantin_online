import mongoose from "mongoose"
import nullRefIdParser from "../../config/nullRefIdParser.js"
import responseParser from "../../helper/responseParser.js"
import uploadToBucket from "../../helper/uploadToBucket.js"
import Menu from "./menuModel.js"
import errorHandler from "../../helper/errorHandler.js"
import MenuCategory from "../MenuCategory/menuCategoryModel.js"

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

        const editedMenu = await Menu.findOneAndUpdate({
            _id: menuId,
            tenant: _id,
        }, data)

        if (!editedMenu) throw Error("No menu found||404")

        return responseParser({ status: 200 }, res)
    } catch (err) {
        return errorHandler(err, res)
    }
}

const getDetail = async (req, res) => {
    try {
        const { _id } = req.params

        const menu = await Menu.findOne({
            _id,
        }).populate("tenant", "full_name description location")

        return responseParser({ status: 200, data: menu }, res)
    } catch (err) {
        return responseParser({ status: 404 }, res)
    }
}

const deleteMenu = async (req, res) => {
    try {
        const { _id } = req.params
        const tenant_id = req.user._id

        const menu = await Menu.findOneAndUpdate({
            _id: _id,
            tenant: tenant_id,
        }, { $set: { is_deleted: true } })

        if (!menu) throw Error

        return responseParser({ status: 200 }, res)
    } catch (err) {
        return responseParser({ status: 404 }, res)
    }
}

const addMenu = async (req, res) => {
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
        return responseParser({ status: 200, data: newMenu }, res)
    } catch (err) {
        return errorHandler(err, res)
    }
}

const addCategory = async (req, res) => {
    try {
        const tenantId = req.user._id
        const { title } = req.body

        const data = {
            title: title,
            tenant: tenantId
        }

        await MenuCategory.create(data)

        return responseParser({ status: 200 }, res)
    } catch (err) {
        return errorHandler(err, res)
    }
}

const editCategory = async (req, res) => {
    try {
        const tenantId = req.user._id
        const { title } = req.body
        const { category_id } = req.params

        const data = {
            title: title,
        }

        const editedMenuCategory = await MenuCategory.findOneAndUpdate({ tenant: tenantId, _id: category_id }, data)

        if (!editedMenuCategory) throw Error("||404")

        return responseParser({ status: 200 }, res)
    } catch (err) {
        return errorHandler(err, res)
    }
}

const getAllCategory = async (req, res) => {
    try {
        const tenantId = req.user._id

        const allCategory = await MenuCategory.find({ tenant: tenantId })

        return responseParser({ status: 200, data: allCategory }, res)
    } catch (err) {
        return errorHandler(err, res)
    }
}

const toggleAvailability = async (req, res) => {
    try {
        const tenantId = req.user._id
        const { _id } = req.params
        
        const menu = await Menu.findOne({ _id: _id, tenant: tenantId })
        if (!menu) throw Error("||404")

        const is_available = !menu.is_available

        await Menu.findOneAndUpdate({ _id: _id, tenant: tenantId }, { $set: { is_available: is_available } })

        return responseParser({ status: 200 }, res)
    } catch (err) {
        return errorHandler(err, res)
    }
}

export default {
    editMenu,
    getDetail,
    addMenu,
    deleteMenu,
    addCategory,
    getAllCategory,
    editCategory,
    toggleAvailability
}