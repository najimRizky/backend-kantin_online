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

export default {
    registerTenant
}