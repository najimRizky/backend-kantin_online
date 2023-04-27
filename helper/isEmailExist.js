import Customer from "../api/Customer/customerModel.js"
import Tenant from "../api/Tenant/tenantModel.js"

const ADMIN_EMAIL = process.env.MAIL_EMAIL

const isEmailExist = async (email) => {
    const customerExist = await Customer.findOne({ email }, ["email"], { skipMiddleware: true })
    const tenantExist = await Tenant.findOne({ email }, ["email"], { skipMiddleware: true })
    const adminExist = email === ADMIN_EMAIL

    if (!!customerExist || !!tenantExist || !!adminExist) {
        return true
    } else {
        return false
    }

}

export default isEmailExist