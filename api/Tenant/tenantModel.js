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
    menus: [{
        type: Schema.Types.ObjectId,
        ref: "Menu"
    }],
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

export default mongoose.model("Tenant", tenantSchema)