import responseParser from "../../helper/responseParser.js";
import Customer from "../Customer/customerModel.js";
import bcrypt from "bcrypt"
import createJWT from "../../helper/createJWT.js";
import roleConfig from "../../config/roleConfig.js";

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // const tenant = await Tenant.findOne({ email });
        // if (tenant) {
        //     const login = await tenantLogin({ email, password, tenant });
        //     return responseParser({ data: { login } }, res);
        // }

        const customer = await Customer.findOne({ email, confirmed: true });
        if (customer) {
            const login = await customerLogin({ email, password, customer });
            return responseParser({ data: login }, res);
        }

        throw new Error("Invalid email or password");
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
    const jwt = createJWT({_id: customer._id, role: roleConfig.customer, email: customer.email})

    return {
        email: customer.email,
        full_name: customer.full_name,
        role: roleConfig.customer,
        profile_image: customer.profile_image,
        jwt
    }
}

// const tenantLogin = async ({ password, tenant }) => {

// }

export default {
    login,
}