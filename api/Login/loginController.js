const responseParser = require("../../helper/responseParser")
const Customer = require("../Customer/customerModel")
const bcrypt = require("bcrypt");
const createJWT = require("../../helper/createJWT");
const roleConfig = require("../../config/roleConfig");

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
    const jwt = createJWT(customer._id)

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

module.exports = {
    login,
}