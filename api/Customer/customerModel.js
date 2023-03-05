const mongoose = require("mongoose");
const bcrypt = require("bcrypt")

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
    profileImage: {
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
        required: true,
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

module.exports = mongoose.model("Customer", customerSchema)