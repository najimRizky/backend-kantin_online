const mongoose = require("mongoose");

const Schema = mongoose.Schema

const tenantSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    menus: [{
        type: Schema.Types.ObjectId,
        ref: "Menu"
    }],
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review"
    }],
    avg_score: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        default: ""
    },
    balance: {
        type: Number,
        default: 0
    }
    

}, { timestamps: true })

module.exports = mongoose.model("Tenant", tenantSchema)