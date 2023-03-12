import responseParser from "../../helper/responseParser.js";
import Customer from "../Customer/customerModel.js";
import Tenant from "../Tenant/tenantModel.js";
import bcrypt from "bcrypt"
import createJWT from "../../helper/createJWT.js";
import roleConfig from "../../config/roleConfig.js";
import sendEmailConfirmation from "../../server/sendEmailConfirmation.js"

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
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

        throw Error;
    } catch (error) {
        return responseParser(
            { status: 404, error: "Invalid email or password!" },
            res
        );
    }
};


const customerLogin = async ({ password, customer }) => {
    const match = await bcrypt.compare(password, customer.password)
    if (!match) {
        throw Error
    }
    const jwt = createJWT({ _id: customer._id, role: roleConfig.customer, email: customer.email })

    return {
        email: customer.email,
        full_name: customer.full_name,
        role: roleConfig.customer,
        profile_image: customer.profile_image,
        jwt
    }
}

const tenantLogin = async ({ password, tenant }) => {
    const match = await bcrypt.compare(password, tenant.password)
    if (!match) {
        throw Error
    }
    const jwt = createJWT({ _id: tenant._id, role: roleConfig.customer, email: tenant.email })

    return {
        email: tenant.email,
        full_name: tenant.full_name,
        role: roleConfig.tenant,
        profile_image: tenant.profile_image,
        jwt
    }
}

// customer only
const register = async (req, res) => {
    const { email, password, full_name } = req.body
    try {
        const emailExist = await Customer.findOne({ email })
        if (emailExist) {
            throw Error("Email already registered")
        }

        const customer = await Customer.register({ email, password, full_name })

        sendEmailConfirmation({
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
        return responseParser({ status: 400, error: err.message }, res)
    }
}

const confirm = async (req, res) => {
    const { token } = req.query

    const customer = await Customer.findOne({ confirmation_token: token })

    if (customer) {
        if (customer.confirmed) {
            return res.send("Your account already confirmed.")
        } else {
            await Customer.updateOne({ _id: customer._id }, { $set: { confirmed: true } })
            return res.send("Account confirmation success! You may login now.")
        }
    } else {
        return responseParser({ status: 404, error: "Invalid account confirmation link" }, res)
    }
}

export default {
    login,
    register,
    confirm
}
