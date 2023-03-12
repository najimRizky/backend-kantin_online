import responseParser from "../../helper/responseParser.js"
import uploadToBucket from "../../helper/uploadToBucket.js"
import sendEmailConfirmation from "../../server/sendEmailConfirmation.js"
import Customer from "./customerModel.js"

const editProfile = async (req, res) => {
    try {
        const { _id } = req.user
        const { full_name } = req.body
        const { profile_image } = await Customer.findById(_id, ["profile_image"])

        const data = { full_name }

        if (req.file) {
            const url = await uploadToBucket({ req, currentUrl: profile_image })
            data.profile_image =  url
        }

        await Customer.findByIdAndUpdate(_id, data)
        return responseParser({ status: 200 }, res)
    } catch (err) {
        console.log(err)
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
        const { _id } = req.user

        await Customer.findByIdAndUpdate(_id, {$inc: {balance: amount}})        
        const updatedCustomer = await Customer.findById(_id)

        return responseParser({ status: 200, data: { balance: updatedCustomer.balance } }, res)
    } catch (err) {
        return responseParser({ status: 404 }, res)
    }
}

export default {
    editProfile,
    getProfile,
    updateBalance
}