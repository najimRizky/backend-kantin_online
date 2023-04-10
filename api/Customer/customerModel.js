import mongoose from "mongoose";
import bcrypt from "bcrypt"

const Schema = mongoose.Schema

const customerSchema = new Schema({
    full_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profile_image: {
        type: String,
        default: ""
    },
    balance: {
        type: Number,
        default: 0
    },
    confirmed: {
        type: Boolean,
        default: false
    },
    confirmation_token: {
        type: String,
    },
    reset_password_token: {
        type: String,
    }
}, { timestamps: true })


customerSchema.statics.register = async function ({ email, password, full_name }) {
    const passwordSalt = await bcrypt.genSalt(5)
    const passwordHash = await bcrypt.hash(password, passwordSalt)

    const confirmationTokenSalt = await bcrypt.genSalt(5)
    const confirmationToken = await bcrypt.hash(email, confirmationTokenSalt)

    const dataCustomer = {
        email,
        password: passwordHash,
        full_name,
        confirmation_token: confirmationToken
    }

    const customer = await this.create(dataCustomer)

    return customer
}

customerSchema.statics.reduceBalance = async function (_id, nominal) {
    const updatedCustomer = await this.findByIdAndUpdate(_id, { $inc: { balance: -nominal } })

    return updatedCustomer
}

customerSchema.statics.resetPassword = async function (_id, new_password) {
    const updatedCustomer = await this.findByIdAndUpdate(_id, {$set: {password: new_password, reset_password_token: null}})

    return updatedCustomer
}

export default mongoose.model("Customer", customerSchema)