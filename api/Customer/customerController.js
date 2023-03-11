import responseParser from "../../helper/responseParser.js"
import uploadToBucket from "../../helper/uploadToBucket.js"
import sendEmailConfirmation from "../../server/sendEmailConfirmation.js"
import Customer from "./customerModel.js"

const editProfile = async (req, res) => {
    try {
        const customerId = req.user._id
        if (req.file) {
            const url = await uploadToBucket({ req })
            await Customer.updateOne({ _id: customerId, full_name: req.body.full_name, profile_image: url })
        } else {
            await Customer.updateOne({ _id: customerId, full_name: req.body.full_name })
        }
        return responseParser({ status: 200 }, res)
    } catch (err) {
        return responseParser({ status: 404 }, res)
    }
}

const getProfile = async (req, res) => {
    try {
        const customerId = req.user._id
        const customer = await Customer.findById(customerId, ["balance", "email", "full_name", "profile_image"]).exec()
        return responseParser({ status: 200, data: customer }, res)
    } catch (err) {
        return responseParser({ status: 404 }, res)
    }
}

const updateBalance = async (req, res) => {
    try {
        const { amount } = req.body
        const customerId = req.user._id
        const customer = await Customer.findOneAndUpdate({ _id: customerId }, { $inc: { balance: amount } })
        return responseParser({ status: 200, data: { balance: customer.balance } }, res)
    } catch (err) {
        return responseParser({ status: 404 }, res)
    }
}

export default {
    editProfile,
    getProfile,
    updateBalance
}