/* eslint-disable no-unused-vars */
import responseParser from "../../helper/responseParser.js";
import Customer from "../Customer/customerModel.js";
import Tenant from "../Tenant/tenantModel.js";
import bcrypt from "bcrypt"
import createAccessToken from "../../helper/createAccessToken.js";
import roleConfig from "../../config/roleConfig.js";
import emailSender from "../../server/emailSender.js"
import errorHandler from "./../../helper/errorHandler.js"
import { nanoid } from "nanoid";
import scheduler from "../../server/scheduler.js";
import isEmailExist from "../../helper/isEmailExist.js";

const ADMIN_EMAIL = process.env.MAIL_EMAIL
const ADMIN_PASSWORD = process.env.MAIL_PASSWORD_ADMIN

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = email === ADMIN_EMAIL && password === ADMIN_PASSWORD
        if (admin) {
            const login = await adminLogin()
            return responseParser({ status: 200, data: login }, res)
        }

        const tenant = await Tenant.findOne({ email });
        if (tenant) {
            const login = await tenantLogin({ password, tenant });
            return responseParser({ data: login }, res);
        }

        const customer = await Customer.findOne({ email, confirmed: true });
        if (customer) {
            const login = await customerLogin({ password, customer });
            return responseParser({ data: login }, res);
        }

        throw Error("Invalid email or password!||404");
    } catch (err) {
        return errorHandler(err, res);
    }
};

const adminLogin = async () => {
    const access_token = createAccessToken({ role: roleConfig.admin, email: ADMIN_EMAIL })
    return {
        email: ADMIN_EMAIL,
        role: roleConfig.admin,
        access_token
    }
}


const customerLogin = async ({ password, customer }) => {
    const match = await bcrypt.compare(password, customer.password)
    if (!match) {
        throw Error("Invalid email or password!||404")
    }
    const access_token = createAccessToken({ _id: customer._id, role: roleConfig.customer, email: customer.email })

    return {
        email: customer.email,
        full_name: customer.full_name,
        role: roleConfig.customer,
        profile_image: customer.profile_image,
        _id: customer._id,
        access_token
    }
}

const tenantLogin = async ({ password, tenant }) => {
    const match = await bcrypt.compare(password, tenant.password)
    if (!match) {
        throw Error("Invalid email or password!||404")
    }
    const access_token = createAccessToken({ _id: tenant._id, role: roleConfig.tenant, email: tenant.email })

    return {
        email: tenant.email,
        full_name: tenant.full_name,
        role: roleConfig.tenant,
        profile_image: tenant.profile_image,
        _id: tenant._id,
        access_token
    }
}

// customer only
const register = async (req, res) => {
    const { email, password, full_name } = req.body
    try {
        if (await isEmailExist(email)) {
            throw Error("Email already used||409")
        }

        const customer = await Customer.register({ email, password, full_name })

        emailSender.sendEmailConfirmation({
            email: customer.email,
            fullName: customer.full_name,
            confirmationToken: customer.confirmation_token
        })

        return responseParser({
            data: {
                email: customer.email,
                full_name: customer.full_name
            },
            message: "New account created, check your email to confirm your account!"
        }, res)
    } catch (err) {
        return errorHandler(err, res)
    }
}

// customer only
const confirm = async (req, res) => {
    try {
        const { token } = req.query
        const customer = await Customer.findOneAndUpdate({ confirmation_token: token, confirmed: false }, { confirmed: true, confirmation_token: null })

        if (!customer) throw Error("Confirmation failed. Your account is already confirmed or invalid token||403")

        return res.render("confirm-account", { BASE_URL_FE: process.env.BASE_URL_FE })

    } catch (err) {
        return errorHandler(err, res)
    }
}

const validateToken = async (req, res) => {
    return responseParser({ status: 200, message: "Access token is valid" }, res)
}

const requestResetPassword = async (req, res) => {
    try {
        const { email } = req.body

        const customer = await Customer.findOne({ email })
        const tenant = await Tenant.findOne({ email })

        if (!customer && !tenant) throw Error(`No user with email ${email} found||404`)

        const user = customer ? customer : tenant
        const role = customer ? "customer" : "tenant"
        const userId = user._id.toString()

        const resetPasswordToken = user.reset_password_token || nanoid(24)

        const fullName = user.full_name

        customer ?
            await Customer.findOneAndUpdate({ email }, { $set: { reset_password_token: resetPasswordToken } }) :
            await Tenant.findOneAndUpdate({ email }, { $set: { reset_password_token: resetPasswordToken } });

        scheduler.assignAutoDeleteResetPasswordToken(userId, role)
        emailSender.sendResetPasswordLink({ email, fullName, resetPasswordToken })

        return responseParser({ status: 200, message: `Reset password email has been sent to your email ${email}` }, res)
    } catch (err) {
        return errorHandler(err, res)
    }
}

// customer only
const resetPassword = async (req, res) => {
    const { token, new_password } = req.body
    try {
        const customer = await Customer.findOne({ reset_password_token: token })
        const tenant = await Tenant.findOne({ reset_password_token: token })

        if (!customer && !tenant) throw Error(`Invalid token||404`)

        const passwordSalt = await bcrypt.genSalt(5)
        const passwordHash = await bcrypt.hash(new_password, passwordSalt)


        customer ? await Customer.resetPassword(customer._id, passwordHash) : Tenant.resetPassword(tenant._id, passwordHash)

        return responseParser({ status: 200, message: "Reset password completed!" }, res)
    } catch (err) {
        return errorHandler(err, res)
    }
}
const capitalizeFullName = (str) => {
    const words = str.toLowerCase().split(' ');
    const capitalizedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));
    const capitalizedString = capitalizedWords.join(' ');
    return capitalizedString;
}

export default {
    login,
    register,
    confirm,
    validateToken,
    requestResetPassword,
    resetPassword
}
