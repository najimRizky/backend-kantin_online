import mongoose from "mongoose";
import { isNotDeleted } from "./../../config/queryConfig.js"

const Schema = mongoose.Schema

const tenantSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    full_name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: ""
    },
    location: {
        type: String,
        default: ""
    },
    profile_image: {
        type: String,
        default: ""
    },
    balance: {
        type: Number,
        default: 0
    },
    is_open: {
        type: Boolean,
        default: true
    },
    reset_password_token: {
        type: String,
    },
    is_deleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })


tenantSchema.statics.register = async function ({ email, password, full_name, location, description }) {
    const dataTenant = {
        email,
        full_name,
        password,
        location,
        description
    }

    const newTenant = await this.create(dataTenant)

    return newTenant
}

tenantSchema.statics.addMenu = async function ({ _id, newMenuId }) {
    await this.findByIdAndUpdate(_id, { $addToSet: { menus: mongoose.Types.ObjectId(newMenuId) } })
    return true
}

tenantSchema.statics.resetPassword = async function (_id, new_password) {
    const updatedCustomer = await this.findByIdAndUpdate(_id, { $set: { password: new_password, reset_password_token: null } })

    return updatedCustomer
}

tenantSchema.statics.addBalance = async function (_id, amount) {
    const updatedTenant = await this.findByIdAndUpdate(_id, { $inc: { balance: amount } })

    return updatedTenant
}

tenantSchema.pre(["find", "findOne", "findOneAndUpdate"], function (next) {
    const { skipMiddleware } = this.getOptions()
    if (skipMiddleware) {
        return next()
    } 

    const existingFilters = this.getFilter()
    this.where({ ...existingFilters, $or: isNotDeleted })
    next()
})

tenantSchema.pre("aggregate", function (next) {
    this.pipeline().unshift({ $match: { $or: isNotDeleted } })
    next()
})

export default mongoose.model("Tenant", tenantSchema)