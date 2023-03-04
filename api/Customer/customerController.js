const responseParser = require("../../helper/responseParser")
const Customer = require("./customerModel")


const registerCustomer = async (req, res) => {
    const {email, password, full_name} = req.body
    try {
        const customer = await Customer.register({email, password, full_name})
        // return responseParser({data: {email, password}, message: "New account created"}, res)
        return responseParser({data: customer, message: "New account created"}, res)
    } catch (err) {
        return responseParser({status: 400, message: err.message}, res)
    }

}

module.exports = {
    registerCustomer
}