import mongoose from "mongoose";

const Schema = mongoose.Schema

const tenantSchema = new Schema({
    email: {
        type: String,
        required: true,
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
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review"
    }],
    orders: [{
        type: Schema.Types.ObjectId,
        rev: "Order"
    }],
    menu_categories: [{
        type: Schema.Types.ObjectId,
        ref: "Menu_Category",
    }],
    avg_score: {
        type: Number,
        default: 0
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
    }
}, { timestamps: true })


tenantSchema.statics.register = async function ({ email, password, full_name }) {
    const dataTenant = {
        email,
        full_name,
        password,
    }

    const newTenant = await this.create(dataTenant)

    return newTenant
}

tenantSchema.statics.addMenu = async function ({_id, newMenuId}) {
    await this.findByIdAndUpdate(_id, {$addToSet: {menus: mongoose.Types.ObjectId(newMenuId)}})
    return true
}

tenantSchema.statics.resetPassword = async function (_id, new_password) {
    const updatedCustomer = await this.findByIdAndUpdate(_id, {$set: {password: new_password, reset_password_token: null}})

    return updatedCustomer
}

export default mongoose.model("Tenant", tenantSchema)