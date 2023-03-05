const mongoose = require("mongoose");

const Schema = mongoose.Schema

const menuSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
    },
    image: {
        type: String,
        default: ""
    },
    price: {
        type: Number,
        required: true,
    },
    prep_duration: {
        type: Number,
        required: true,
    },
}, { timestamps: true })

module.exports = mongoose.model("Menu", menuSchema)