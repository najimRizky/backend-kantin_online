const responseParser = require("../../helper/responseParser")
const sendEmailConfirmation = require("../../server/sendEmailConfirmation")
const Customer = require("./customerModel")


const registerCustomer = async (req, res) => {
    const { email, password, full_name } = req.body
    try {
        const customer = await Customer.register({ email, password, full_name })

        sendEmailConfirmation({
            email: customer.email,
            full_name: customer.full_name,
            confirmationToken: customer.confirmationToken
        })

        return responseParser({ data: customer, message: "New account created" }, res)
    } catch (err) {
        return responseParser({ status: 400, message: err.message }, res)
    }
}

const confirmCustomer = async (req, res) => {
    const { token } = req.query

    const customer = await Customer.findOne({confirmationToken: token})

    if(customer) {
        await Customer.updateOne({_id: customer._id}, {$set: {confirmed: true}})
        return res.send("Your email has been confirmed. You may login now.")
    } else {
        return responseParser({status: 404, message: "Invalid confirmation link"}, res)
    }
}

module.exports = {
    registerCustomer,
    confirmCustomer
}