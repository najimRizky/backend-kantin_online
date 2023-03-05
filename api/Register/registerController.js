const responseParser = require("../../helper/responseParser")
const sendEmailConfirmation = require("../../server/sendEmailConfirmation")
const Customer = require("../Customer/customerModel")

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

module.exports = {
    register,
    confirm
}