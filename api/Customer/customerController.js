import responseParser from "../../helper/responseParser.js"
import uploadToBucket from "../../helper/uploadToBucket.js"
import Customer from "./customerModel.js"
import errorHandler from "./../../helper/errorHandler.js"
import bcrypt from "bcrypt"
import isEmailExist from "../../helper/isEmailExist.js"

const editProfileImage = async (req, res) => {
    try {
        const { _id } = req.user
        const { profile_image } = await Customer.findById(_id, ["profile_image"])

        const url = await uploadToBucket({ req, currentUrl: profile_image })
        const newProfileImage = url
        await Customer.findByIdAndUpdate(_id, { profile_image: newProfileImage })

        return responseParser({ status: 200 }, res)
    } catch (err) {
        return errorHandler(err, res)
    }
}

const editProfile = async (req, res) => {
    try {
        const { _id } = req.user
        const { full_name, email } = req.body

        const customer = await Customer.findById(_id, ["email"])

        if (email !== customer.email) {
            if (await isEmailExist(email)) {
                throw Error("Email already used||409")
            }
        }

        const data = { full_name, email }

        await Customer.findByIdAndUpdate(_id, data)
        return responseParser({ status: 200 }, res)
    } catch (err) {
        return errorHandler(err, res)
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

        await Customer.findByIdAndUpdate(_id, { $inc: { balance: amount } })
        const updatedCustomer = await Customer.findById(_id)

        return responseParser({ status: 200, data: { balance: updatedCustomer.balance } }, res)
    } catch (err) {
        return responseParser({ status: 404 }, res)
    }
}

const changePassword = async (req, res) => {
    try {
        const { password, new_password, confirm_new_password } = req.body
        const { _id } = req.user

        if (new_password !== confirm_new_password) {
            throw Error("New password and confirm new password must be the same||400")
        }

        const customer = await Customer.findById(_id, ["password"])

        if (!customer) {
            throw Error("Customer not found||404")
        }

        const isCorrectPassword = await bcrypt.compare(password, customer?.password)

        if (!isCorrectPassword) {
            throw Error("Old password is incorrect||400")
        }

        const hashedNewPassword = await bcrypt.hash(new_password, 5)

        await Customer.findByIdAndUpdate(_id, { password: hashedNewPassword })

        return responseParser({ status: 200 }, res)
    } catch (err) {
        return errorHandler(err, res)
    }
}

export default {
    editProfile,
    getProfile,
    updateBalance,
    editProfileImage,
    changePassword
}