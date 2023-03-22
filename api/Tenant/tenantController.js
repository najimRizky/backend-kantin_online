import responseParser from "../../helper/responseParser.js"
import uploadToBucket from "../../helper/uploadToBucket.js"
import Tenant from "./tenantModel.js"
import Customer from "../Customer/customerModel.js";
import Menu from "../Menu/menuModel.js";
import bcrypt from "bcrypt"

const editProfile = async (req, res) => {
    try {
        const { _id } = req.user
        const { full_name, location, description } = req.body
        const { profile_image } = await Tenant.findById(_id, ["profile_image"])

        const data = { full_name, location, description }

        if (req.file) {
            const url = await uploadToBucket({ req, currentUrl: profile_image })
            data.profile_image = url
        }

        await Tenant.findByIdAndUpdate(_id, data)
        return responseParser({ status: 200 }, res)
    } catch (err) {
        console.log(err)
        return responseParser({ status: 404 }, res)
    }
}

const register = async (req, res) => {
    const { email, password, full_name } = req.body

    try {
        const emailExistCustomer = await Tenant.findOne({ email })
        const emailExistTenant = await Customer.findOne({ email })

        if (emailExistCustomer || emailExistTenant) {
            throw Error("Email already registered")
        }

        const passwordSalt = await bcrypt.genSalt(5)
        const passwordHash = await bcrypt.hash(password, passwordSalt)

        const newTenant = await Tenant.register({ email, password: passwordHash, full_name })

        return responseParser({
            data: {
                email: newTenant.email,
                full_name: newTenant.full_name
            },
            message: "New tenant created"
        }, res)
    } catch (err) {
        return responseParser({ status: 400, error: err.message }, res)
    }
}

const getProfile = async (req, res) => {
    try {
        const { _id } = req.user
        const tenant = await Tenant.findById(_id, ["balance", "email", "full_name", "profile_image", "orders"])

        if (!tenant) {
            throw Error
        }

        return responseParser({ status: 200, data: tenant }, res)
    } catch (err) {
        return responseParser({ status: 404 }, res)
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
                "avg_score",
                "location",
                "is_open",
            ])

        if (!tenant) throw Error

        const menu = await Menu.find({ tenant: _id }, [
            "title",
            "description",
            "category",
            "image",
            "price"
        ])

        const respData = await { ...tenant._doc, menu }

        return responseParser({ status: 200, data: respData }, res)
    } catch (err) {
        return responseParser({ status: 404 }, res)
    }
}
const getAll = async (_, res) => {
    try {
        const tenant = await Tenant.find({}, [
            "profile_image",
            "full_name",
            "description",
            "label",
            "avg_score",
            "location",
            "is_open",
        ])

        if (!tenant) throw Error

        return responseParser({ status: 200, data: tenant }, res)
    } catch (err) {
        return responseParser({ status: 404 }, res)
    }
}

export default {
    editProfile,
    getProfile,
    register,
    getDetail,
    getAll
}