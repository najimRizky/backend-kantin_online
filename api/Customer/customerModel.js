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
    confirmed: {
        type: Boolean,
        default: false
    },
    confirmationToken: {
        type: String,
        required: true,
    }
}, { timestamps: true })


customerSchema.statics.register = async function ({ email, password, full_name }) {
    const emailExist = await this.findOne({ email })
    
    if (emailExist) {
        throw Error("Email already registered")
    }
    
    const salt = await bcrypt.genSalt(5)
    const passwordHash = await bcrypt.hash(password, salt)
    const confirmationToken = await bcrypt.hash(email, salt)
    
    const dataCustomer = {
        email, 
        password: passwordHash,
        full_name,
        confirmationToken
    }
    
    const customer = await this.create(dataCustomer)
    
    return customer
}

module.exports = mongoose.model("Customer", customerSchema)